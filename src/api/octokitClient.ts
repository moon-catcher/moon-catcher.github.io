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
const updateOctokitToken = () => {
  const authToken = getCookie(COOKIE_KEY_TOKEN);
  octokit = new Octokit({
    auth: authToken,
  });
};

export default octokit;
export { updateOctokitToken };
