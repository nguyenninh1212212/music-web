import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor cho Request
axiosClient.interceptors.request.use(
  (config) => {
    // Hàm nội tuyến đơn giản để lấy token
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.user.token) {
          config.headers.Authorization = `Bearer ${user.user.token}`;
        }
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- LOGIC REFRESH TOKEN ---

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
  isRefreshing = false;
};

const logout = () => {
  localStorage.removeItem("user");
  window.location.href = "/login";
};

axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const rs = await axiosClient.get("/refresh");

        const newAccessToken = rs.data.user.token;
        console.log("🚀 ~ newAccessToken:", newAccessToken);

        localStorage.setItem("user", JSON.stringify(rs.data));
        axiosClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return axiosClient(originalRequest);
      } catch (_error) {
        const refreshError = _error as AxiosError;
        processQueue(refreshError, null);
        console.error("Refresh token failed, logging out", refreshError);
        logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
