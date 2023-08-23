import axios from "axios";

const apiClient = axios.create({
  timeout: 1000,
  headers: {
    Accept: "application/vnd.github.v3+json",
    "Access-Control-Allow-Origin": true,
  },
});
// b8a58a36ef2ebb6ca56c13eca24dfcb72280de4b

//client_id
//login
//scope write:repo_hook

export default apiClient;
