import axios from "axios";

export const httpService = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

httpService.interceptors.request.use(
  (config) => config,
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

httpService.interceptors.response.use(
  (response) => response,
  async (error) => {
    // if (error?.response?.status === 401) {
    //   await AuthServices.refresh();
    // } else {
    //   console.error("Response Error:", error.response?.data || error);
    // }

    return Promise.reject(error);
  }
);
