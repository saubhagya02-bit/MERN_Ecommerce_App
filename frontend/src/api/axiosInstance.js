import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  if (auth?.token) {
    config.headers.Authorization = auth.token;
  }
  return config;
});

export default axiosInstance;
