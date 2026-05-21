import { createSlice } from "@reduxjs/toolkit";

let savedAuth = null;
try {
  savedAuth = JSON.parse(localStorage.getItem("auth"));
} catch {
  localStorage.removeItem("auth");
}

const initialState = {
  user: savedAuth?.user || null,
  token: savedAuth?.token || "",

  authVerified: savedAuth?.token ? null : false,
  adminVerified: savedAuth?.token ? null : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.authVerified = true;
      state.adminVerified = user?.role === 1 ? true : false;
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem(
        "auth",
        JSON.stringify({ user: action.payload, token: state.token }),
      );
    },
    logout: (state) => {
      state.user = null;
      state.token = "";
      state.authVerified = false;
      state.adminVerified = false;
      localStorage.removeItem("auth");
    },

    setAuthVerified: (state, action) => {
      state.authVerified = action.payload;
    },

    setAdminVerified: (state, action) => {
      state.adminVerified = action.payload;
    },
  },
});

export const {
  setCredentials,
  updateUser,
  logout,
  setAuthVerified,
  setAdminVerified,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAdmin = (state) => state.auth.user?.role === 1;
export const selectAuthVerified = (state) => state.auth.authVerified;
export const selectAdminVerified = (state) => state.auth.adminVerified;

export default authSlice.reducer;
