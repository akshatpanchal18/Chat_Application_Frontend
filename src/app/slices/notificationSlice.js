// notificationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER;
export const getNotifications = createAsyncThunk(
  "notification/fetchNotification",
  async () => {
    const res = await axios.get(`${API_URL}/notification/get-notification`, {
      withCredentials: true,
    });
    return res.data.data;
  }
);
export const updateNotification = createAsyncThunk(
  "notification/updtaeNotification",
  async () => {
    const res = await axios.patch(
      `${API_URL}/notification/update-notification`,
      {}, // <-- Empty data because PATCH mein kuch bhejna nahi hai
      {
        withCredentials: true, // <-- Correct place
      }
    );
    return res.data;
  }
);

const notificationReducer = createSlice({
  name: "notification",
  initialState: {
    notification: {},
    offlineList: [],
    count: "",
    success: "",
    isLoading: false,
    isError: false,
    error: null,
  },
  reducers: {
    incrementUnread: (state, action) => {
      const chatId = action.payload;
      state.notification[chatId] = (state.notification[chatId] || 0) + 1;
    },
    clearUnread: (state, action) => {
      const chatId = action.payload;
      state.notification[chatId] = 0;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotifications.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      (state.isLoading = false), (state.offlineList = action.payload);
      // console.log("Notifications", action.payload);
      state.count = action.payload.length;
    });
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
    //update notification
    builder.addCase(updateNotification.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(updateNotification.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = "notifications mark as read";
      setTimeout(() => {
        state.success = "";
      }, 5000);
    });
    builder.addCase(updateNotification.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
  },
});

export const { incrementUnread, clearUnread } = notificationReducer.actions;

export default notificationReducer.reducer;
