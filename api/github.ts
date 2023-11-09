import { AccessToken } from "@type/user";
import apiClient from "./apiClient";
import { Octokit } from "octokit";

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

export const apiGetRepoPathFiles = async (
  octokit: Octokit,
  options: { repo?: string; owner: string; path?: string }
) => {
  return await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
    owner: options.owner,
    repo: options.repo ?? `${options.owner}.github.io`,
    path: options.path ?? "blog",
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
};
