import apiClient from "./apiClient";

/**
 * client_id=230d10a766b329d1d0ce
login=Mysetsuna
scope=write:repo_hook
redirect_uri=https://mysetsuna.github.io/save-money
 */
export const getAuthorize = () => {
  return apiClient.get("https://github.com/login/oauth/authorize", {
    params: {
      client_id: "230d10a766b329d1d0ce",
      login: "Mysetsuna",
      scope: "write:repo_hook",
      redirect_uri: "https://mysetsuna.github.io/save-money",
    },
  });
};
