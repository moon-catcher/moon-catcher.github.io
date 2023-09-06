import { UserInfo } from "@/types";
import apiClient from "./apiClient";

export const getUserInfo = async (userId: string) => {
  return await new Promise<UserInfo>((resolve) => {
    setTimeout(() => {
      if (userId === "Jack") {
        resolve({ name: userId, dashboard: [1, 2] });
      } else if (userId === "John") {
        resolve({ name: userId, dashboard: [2] });
      } else {
        resolve({ name: userId, dashboard: [] });
      }
    }, 500);
  });
};

export const loginByAuth = async (data: {
  code: string;
  state: string;
  authkey: string;
}) => {
  return await apiClient.post(`/login`, data, { withCredentials: true });
};
