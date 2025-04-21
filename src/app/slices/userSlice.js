import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER;

export const userProfile = createAsyncThunk("user/profile", async () => {
  const res = await axios.get(`${API_URL}/user/user-profile`, {
    withCredentials: true,
  });
  return res.data;
});
export const userProfilewithChatData = createAsyncThunk(
  "user/profilewith chat details",
  async (chatId) => {
    const res = await axios.get(
      `${API_URL}/user/get-user-chatdetails/${chatId}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  }
);
export const usersList = createAsyncThunk(
  "user/userList--createchat",
  async ({ query }) => {
    const res = await axios.get(`${API_URL}/user/all-users?search=${query}`, {
      withCredentials: true,
    });
    return res.data;
  }
);
const userReducer = createSlice({
  name: "user",
  initialState: {
    user: [],
    userChat: [],
    userList: [],
    isLoading: false,
    isError: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(userProfile.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(userProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      // console.log(action.payload);
    });
    builder.addCase(userProfile.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
    //fetch receiver user profile by ID----------------
    builder.addCase(userProfilewithChatData.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(userProfilewithChatData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userChat = action.payload.data;
      // console.log(action.payload);
    });
    builder.addCase(userProfilewithChatData.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
    //users list for create chat -----------------------
    builder.addCase(usersList.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(usersList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userList = action.payload.data;
      // console.log(action.payload);
    });
    builder.addCase(usersList.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
  },
});

export default userReducer.reducer;
