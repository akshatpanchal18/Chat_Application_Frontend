import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentTheme: localStorage.getItem("theme") || "theme-plate1",
  },
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload; // Set the theme dynamically
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
