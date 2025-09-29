import axios from "axios";
import { logout } from "../login-services";
import Constants from "../../utils/constants";

//creating a common interceptor
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Request Interceptor: Add Authorization token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(Constants.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers["Content-Type"] = "application/json";
    config.headers["x-api-key"] = process.env.REACT_APP_API_KEY || "";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized request, redirecting to login...");
      logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
