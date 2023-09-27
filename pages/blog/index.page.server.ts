export { onBeforeRender };

import { DEFAULT_HEADER } from "@constant/auth";
import { PageContextServer } from "../../renderer/types";

async function onBeforeRender(pageContext: PageContextServer) {
  const { octokit } = pageContext;
  let data;
  if (octokit) {
    const res = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      {
        owner: "moon-catcher",
        repo: "moon-catcher.github.io",
        path: "blog/articles",
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
