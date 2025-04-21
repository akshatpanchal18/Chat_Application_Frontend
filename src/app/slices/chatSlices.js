import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER;

export const createChat = createAsyncThunk(
  "chat/createChat",
  async (payload) => {
    const res = await axios.post(`${API_URL}/chat/create-chat`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res.data;
  }
);
export const fetchChat = createAsyncThunk(
  "chat/fetchAllChat",
  async (search) => {
    const res = await axios.get(
      `${API_URL}/chat/get-all-chat?search=${search}`,
      {
        withCredentials: true,
      }
    );
    return res.data;
  }
);
export const fetchChatById = createAsyncThunk(
  "chat/fetchChatById",
  async (chatId) => {
    const res = await axios.get(`${API_URL}/chat/get-chat/${chatId}`, {
      withCredentials: true,
    });
    return res.data;
  }
);
const chatReducer = createSlice({
  name: "chat",
  initialState: {
    chatList: [],
    selectedChatId: null,
    activeChat: null,
    isLoading: false,
    isError: false,
    error: null,
  },
  reducers: {
    addNewChat: (state, action) => {
      console.log("addNewChat action received:", action.payload); // Log action
      const exists = state.chatList.find((c) => c._id === action.payload._id);
      if (!exists) {
        state.chatList.unshift(action.payload); // Add new chat at the top
      }
    },
    setChatId: (state, action) => {
      console.log("setChatId called", action.payload);

      state.selectedChatId = action.payload;
    },
    unSetChatId: (state, action) => {
      console.log("unSetChatId called", action.payload);
      if (state.selectedChatId === action.payload) {
        state.selectedChatId = null;
      }
    },
  },
  extraReducers: (builder) => {
    //CreateChat----------------
    builder.addCase(createChat.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(createChat.fulfilled, (state, action) => {
      state.isLoading = false;

      // If state.chats is already an array
      // if (Array.isArray(state.chats)) {
      //   state.chats.unshift(action.payload); // Add to top
      // } else {
      //   state.chats = [action.payload]; // Initialize if it's undefined
      // }
    });

    builder.addCase(createChat.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
    // fetch all chat----------------
    builder.addCase(fetchChat.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChat.fulfilled, (state, action) => {
      state.isLoading = false;
      state.chatList = action.payload.data;
      // console.log(action.payload);
    });
    builder.addCase(fetchChat.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
    // fetch chat by ID----------------
    builder.addCase(fetchChatById.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchChatById.fulfilled, (state, action) => {
      state.isLoading = false;
      state.activeChat = action.payload.data;
      // console.log(action.payload);
    });
    builder.addCase(fetchChatById.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
  },
});

export const { addNewChat, setChatId, unSetChatId } = chatReducer.actions;
export default chatReducer.reducer;
