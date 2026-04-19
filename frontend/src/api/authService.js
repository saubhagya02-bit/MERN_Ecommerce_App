import axiosInstance from "./axiosInstance";

const authService = {
  register: (userData) => axiosInstance.post("/auth/register", userData),
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  forgotPassword: (data) => axiosInstance.post("/auth/forgot-password", data),
  updateProfile: (data) => axiosInstance.put("/auth/profile", data),
  checkUserAuth: () => axiosInstance.get("/auth/user-auth"),
  checkAdminAuth: () => axiosInstance.get("/auth/admin-auth"),
  getAllUsers: () => axiosInstance.get("/auth/all-users"),
};

export default authService;
