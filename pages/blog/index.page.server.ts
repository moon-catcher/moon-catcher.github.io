export { onBeforeRender };

import { DEFAULT_HEADER } from "@constant/auth";
import { PageContextServer } from "../../renderer/types";

async function onBeforeRender(pageContext: PageContextServer) {
  const { octokit } = pageContext;
  let data;
  console.log(octokit, "******************");
  if (octokit) {

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

  console.log(data, "77777777777");
  return {
    pageContext: {
      user: data,
    },
  };
}
