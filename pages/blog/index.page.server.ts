export { onBeforeRender };

import { Octokit } from "@octokit/action";
import { DEFAULT_HEADER } from "@constant/auth";

async function onBeforeRender() {
  let octokit;
  let data;

  if (import.meta.env.GITHUB_TOKEN) {
    octokit = new Octokit();
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        //"moon-catcher",
        owner: import.meta.env.GITHUB_OWNER,
        // "moon-catcher.github.io"
        repo: import.meta.env.GITHUB_REPOSITORY,
        path: import.meta.env.GITHUB_ARTICLES,
        headers: DEFAULT_HEADER,
      }
    );
    data = res.data;
  }
  console.log(octokit, "******************");
  console.log(data, "77777777777");
  return {
    pageContext: {
      user: data,
    },
  };
}
