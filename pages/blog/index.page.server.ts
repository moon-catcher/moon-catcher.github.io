export { onBeforeRender };

import { PageContextServer } from "../../renderer/types";

async function onBeforeRender(pageContext: PageContextServer) {
  const { octokit } = pageContext;
  const { data } = await octokit.request("GET /user");
  console.log(data, "88888");
  return {
    pageContext: {
      user: data,
    },
  };
}
