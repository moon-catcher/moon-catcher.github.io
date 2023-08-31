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
  console.log(authToken, "authToken");

  octokit = new Octokit({
    auth: authToken,
  });
  return octokit;
};

export default octokit;
export { updateOctokitToken };
