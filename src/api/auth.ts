// src/services/userService.js
import { ILoginForm, IRegisterForm, IPasswordData } from "@/lib/types";
import axiosClient from "./axios"; // ✅ Import axiosClient đã cấu hình

const BASE_PATH = "/user";

const userApi = {
  login: (loginForm: ILoginForm) => {
    return axiosClient.post(`${BASE_PATH}/login`, loginForm);
  },

  register: (userData: IRegisterForm) => {
    return axiosClient.post(`${BASE_PATH}/register`, userData);
  },

  refreshToken: () => {
    return axiosClient.get(`${BASE_PATH}/refresh`);
  },

  getAllUsers: () => {
    return axiosClient.get(`${BASE_PATH}/`);
  },

  changePassword: (passwordData: IPasswordData) => {
    return axiosClient.post(`${BASE_PATH}/change-password`, passwordData);
  },

  logout: () => {
    return axiosClient.post(`${BASE_PATH}/logout`);
  },

  googleLogin: (credential: string) => {
    return axiosClient.post(`${BASE_PATH}/google`, { credential });
  },
  addWallet: (walletAddress: string) => {
    return axiosClient.post(`${BASE_PATH}/add-wallet`, { walletAddress });
  },
};

export default userApi;
