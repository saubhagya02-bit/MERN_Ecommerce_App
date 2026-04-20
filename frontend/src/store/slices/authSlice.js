import { createSlice } from "@reduxjs/toolkit";

const savedAuth = JSON.parse(localStorage.getItem("auth") || "null");

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("auth", JSON.stringify({ user, token }));

      if (user?.role === 1) {
        localStorage.removeItem("cart");
      }
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      const existing = JSON.parse(localStorage.getItem("auth") || "{}");
      existing.user = action.payload;
      localStorage.setItem("auth", JSON.stringify(existing));
    },
    logout: (state) => {
      state.user = null;
      state.token = "";
      localStorage.removeItem("auth");

      localStorage.removeItem("cart");
    },
  },
});

export const { setCredentials, updateUser, logout } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.user?.role === 1;

export default authSlice.reducer;
