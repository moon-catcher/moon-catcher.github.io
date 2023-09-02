import { COOKIE_KEY_TOKEN } from "@/constant/auth";
import { getCookie } from "@/utils/cookieUtils";
import { Octokit } from "octokit";

const token = getCookie(COOKIE_KEY_TOKEN);

let octokit = new Octokit({
  auth: token,
});

/**
 * update octokit token
 */
const updateOctokitToken = (token?: string) => {
  const authToken = token ?? getCookie(COOKIE_KEY_TOKEN);
  if (authToken) {
    octokit = new Octokit({
      auth: authToken,
    });
  }
};

export default octokit;
export { updateOctokitToken };
