import { AccessToken } from "@/types";
import apiClient from "./apiClient";

/**
 * client_id=230d10a766b329d1d0ce
login=Mysetsuna
scope=write:repo_hook
redirect_uri=https://mysetsuna.github.io/save-money
client_secret:e526d845d9ccf0acce71cfe93d91ac26fc90f171
 */
export const getAccessToken = async (
  code: string,
  state: string
): Promise<{ data: AccessToken }> => {
  const url = `/authenticate/${code}/${state}`;
  return await apiClient.get(url, { withCredentials: true });
};

export const putCookie = async (
  cookies: { [prop: string]: string } & { expires?: string; httpOnly?: boolean }
) => {
  const { expires, httpOnly = false, ...rest } = cookies;
  return await apiClient.put(
    "/cookie",
    { cookies: rest, expires, httpOnly },
    { withCredentials: true }
  );
};
