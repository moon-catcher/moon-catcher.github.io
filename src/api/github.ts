import apiClient from "./apiClient";

/**
 * client_id=230d10a766b329d1d0ce
login=Mysetsuna
scope=write:repo_hook
redirect_uri=https://mysetsuna.github.io/save-money
client_secret:e526d845d9ccf0acce71cfe93d91ac26fc90f171
 */
export const getAccessToken = async (code: string) => {
  // const url = "http://localhost:3000/login/oauth/access_token";
  //   return await apiClient.post(
  //     url,
  //     {
  //       client_id: "230d10a766b329d1d0ce",
  //       client_secret: "e526d845d9ccf0acce71cfe93d91ac26fc90f171",
  //       code,
  //     },
  //     {
  //       headers: {
  //         Accept: "application/json",
  //       },
  //     }
  //   );
  const url = `http://localhost:3000/authenticate/${code}`;
  return await apiClient.get(url);
};
//github.com/login/oauth/access_token

export const getUserInfo = async () => {
  console.log(
    apiClient.defaults.headers["Authorization"],
    'apiClient.defaults.headers["Authorization"]'
  );
  return await apiClient.get(`http://localhost:3000/api/user`);
};

export function randomString(length: number) {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

/**
 * 
 * fetch(new Request("https://github.com/login/oauth/access_token",{
    method:'POST', 
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body:"param1=value1&param2=value2"
})).then((resp)=>{console.log(resp)})
 */
