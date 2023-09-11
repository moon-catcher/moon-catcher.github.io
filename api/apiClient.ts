import axios from "axios";

const apiClient = axios.create({
  timeout: 3000,
  baseURL: import.meta.env.vite_github_caller,
});

export default apiClient;
