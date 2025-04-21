import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER;

export const userLogin = createAsyncThunk("auth/login", async (loginData) => {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, loginData, {
      withCredentials: true,
    });

    // console.log("auth slice_LOGIN", res.data);
    return res.data;
  } catch (error) {
    return console.log("auth-login ERROR:", error);
  }
});

export const userRegistration = createAsyncThunk(
  "auth/register",
  async (regData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, regData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);
export const userLogout = createAsyncThunk("auth/logout", async () => {
  try {
    const res = await axios.post(`${API_URL}/auth/logout`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return console.log(error.response?.data || "logout failed");
  }
});
export const verifyToken = createAsyncThunk("auth/token", async () => {
  try {
    const res = await axios.get(`${API_URL}/auth/verify-token`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    return console.log(error.response?.data || "logout failed");
  }
});
const authReducer = createSlice({
  name: "auth",
  initialState: {
    onlineStatus: {},
    authUser: JSON.parse(localStorage.getItem("authUser")) || null,
    isAuth: localStorage.getItem("isAuth") === "true" ? true : false,
    isLoading: false,
    isError: false,
    error: null,
  },
  reducers: {
    updateUserStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      state.onlineStatus[userId] = isOnline;
    },
  },
  extraReducers: (builder) => {
    //login reducers
    builder.addCase(userLogin.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.isLoading = false;
      state.authUser = action.payload;
      state.isAuth = true;
      localStorage.setItem("isAuth", true);
      localStorage.setItem("authUser", JSON.stringify(action.payload.data));
      console.log("Login Successful - isAuth:", state.isAuth, action.payload);
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error =
        action.payload?.response?.statusText || action.payload?.message;
      console.log("error:", action.payload);
    });
    //register reducers
    builder.addCase(userRegistration.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(userRegistration.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      state.authUser = action.payload;
      localStorage.setItem("isAuth", true);
      localStorage.setItem("authUser", JSON.stringify(action.payload));
    });
    builder.addCase(userRegistration.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error =
        action.payload?.response?.statusText || action.payload?.message;
      console.log("error:", action.payload);
    });
    //logout reducers
    builder.addCase(userLogout.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(userLogout.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      localStorage.clear();
      console.log("logout Successful - isAuth:", state.isAuth);
    });
    builder.addCase(userLogout.rejected, (state, action) => {
      state.isError = true;
      state.error =
        action.payload?.response?.statusText || action.payload?.message;
      console.log("error:", action.payload);
    });
    //verify token
    builder.addCase(verifyToken.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(verifyToken.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuth = true;
      console.log("token verify Successful", action.payload);
    });
    builder.addCase(verifyToken.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuth = false;
      state.isError = true;
      state.error = action.payload?.response?.statusText;
      localStorage.clear();
    });
  },
});
export const { updateUserStatus } = authReducer.actions;
export default authReducer.reducer;
