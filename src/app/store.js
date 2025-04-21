import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlices";
import chatReducer from "./slices/chatSlices";
import userReducer from "./slices/userSlice";
import messageReducer from "./slices/messageSlice";
import notificationReducer from "./slices/notificationSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    chat: chatReducer,
    user: userReducer,
    message: messageReducer,
    notification: notificationReducer,
  },
});
// console.log("Redux Store Initialized:", store.getState());
