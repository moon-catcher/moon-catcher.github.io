import axios from "axios";

const apiClient = axios.create({
  timeout: 1000,
  withCredentials: true,
  baseURL: import.meta.env.vite_github_caller,
});
// b8a58a36ef2ebb6ca56c13eca24dfcb72280de4b

//client_id
//login
//scope write:repo_hook

export default apiClient;
