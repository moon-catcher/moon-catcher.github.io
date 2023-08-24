import axios from "axios";

const apiClient = axios.create({
  timeout: 1000,
  withCredentials: true,
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});
// b8a58a36ef2ebb6ca56c13eca24dfcb72280de4b

//client_id
//login
//scope write:repo_hook

export default apiClient;
