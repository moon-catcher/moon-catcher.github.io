import { UserInfo } from "@/types";

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
