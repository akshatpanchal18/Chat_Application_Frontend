import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_SERVER;

export const fetchMessages = createAsyncThunk(
  "message/fetchMessages",
  async (chatId) => {
    const res = await axios.get(`${API_URL}/message/all-messages/${chatId}`, {
      withCredentials: true,
    });
    return res.data.data;
  }
);
export const sendMessage = createAsyncThunk(
  "message/sendMessage",
  async ({ formData }) => {
    const res = await axios.post(`${API_URL}/message/send-message`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.data;
  }
);
export const fetchMedia = createAsyncThunk(
  "message/fetchMedia",
  async ({ chatId }) => {
    const res = await axios.get(`${API_URL}/message/all-media/${chatId}`, {
      withCredentials: true,
    });
    return res.data;
  }
);
const messageReducer = createSlice({
  name: "message",
  initialState: {
    messages: [],
    media: [],
    isLoading: false,
    isError: false,
    error: null,
  },
  reducers: {
    // addMessage: (state, action) => {
    //   state.messages.push(action.payload);
    // },
    addMessage: (state, action) => {
      const incoming = action.payload;
      const alreadyExists = state.messages.find(
        (msg) => msg._id === incoming._id
      );
      if (!alreadyExists) {
        state.messages.push(incoming);
      }
    },

    setMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    // updateMessageSeen: (state, action) => {
    //   const { chatId, userId } = action.payload;
    //   state.messages = state.messages.map((msg) => {
    //     if (msg.chat === chatId && !msg.seenBy?.includes(userId)) {
    //       return {
    //         ...msg,
    //         seenBy: [...(msg.seenBy || []), userId],
    //       };
    //     }
    //     return msg;
    //   });
    // },
    updateMessageSeen: (state, action) => {
      const { messageId, userId } = action.payload;
      state.messages = state.messages.map((msg) => {
        if (msg._id === messageId && !msg.seenBy?.includes(userId)) {
          return {
            ...msg,
            seenBy: [...(msg.seenBy || []), userId],
          };
        }
        return msg;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.messages = action.payload; // assuming action.payload is an array
    });
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
    //send messgae
    builder.addCase(sendMessage.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.isLoading = false;
      // state.messages.push(action.payload); // ✅ No .data
    });
    builder.addCase(sendMessage.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
    //fetch all media
    builder.addCase(fetchMedia.pending, (state, action) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMedia.fulfilled, (state, action) => {
      state.isLoading = false;
      state.media = action.payload.data;
    });
    builder.addCase(fetchMedia.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.response?.statusText;
    });
  },
});
export const { setMessage, addMessage, updateMessageSeen } =
  messageReducer.actions;
export default messageReducer.reducer;
