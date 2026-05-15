import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("theme") || "light";

document.documentElement.classList.toggle("dark", savedTheme === "dark");

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: savedTheme,
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";

      document.documentElement.classList.toggle("dark", state.mode === "dark");

      localStorage.setItem("theme", state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      document.documentElement.classList.toggle(
        "dark",
        action.payload === "dark",
      );
      localStorage.setItem("theme", action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;

export const selectTheme = (state) => state.theme.mode;
export const selectIsDark = (state) => state.theme.mode === "dark";

export default themeSlice.reducer;
