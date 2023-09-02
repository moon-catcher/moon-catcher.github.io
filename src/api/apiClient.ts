import { MOON_CATHCER_PUBKEY } from "@/constant/api";
import axios from "axios";

const apiClient = axios.create({
  timeout: 1000,
  withCredentials: true,
  baseURL: import.meta.env.vite_github_caller,
});

//请求拦截
axios.interceptors.request.use(
  function (config) {
    const excludesArr = ["/api/getpubkey"];
    const { url, params, data, method } = config;
    if (!excludesArr.includes(url)) {
      let Authorization = "";
      if (method === "get" && params) {
        Authorization = hashSHA246(params);
      } else if (method === "post" && data) {
        Authorization = hashSHA246(data);
      }
      // 获取保存的公钥
      const pubKey = sessionStorage.getItem("pubKey");
      //实例化 jsencrypt
      const JSencrypt = new jsencrypt();
      // 对实例化对象设置公钥
      JSencrypt.setPublicKey(pubKey);
      // 通过公钥对数据加密
      const encrypt = JSencrypt.encrypt(Authorization);
      // 加密数据添加到请求头中
      config.headers.common["Authorization"] = encrypt;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.get("publickey").then((res) => {
  sessionStorage.setItem(MOON_CATHCER_PUBKEY, res.data.data);
});

export default apiClient;
