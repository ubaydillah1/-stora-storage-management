import axios from "axios";
import { API_BASE_URL } from "./config";
import { getCookie } from "@/utils/getCookie";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const csrfToken = getCookie("csrfToken");

    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log(err);
  }
);
