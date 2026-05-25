import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.error("❌ VITE_API_URL is not defined in Vercel env variables");
}

const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api/v1`,
});

axiosInstance.interceptors.request.use((config) => {
  let auth = null;

  try {
    auth = JSON.parse(localStorage.getItem("auth"));
  } catch (err) {
    console.error("Auth parse error:", err);
  }

  if (auth?.token) {
    config.headers.Authorization = auth.token;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unexpected error";

    console.error("API Error:", message);

    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;