export { onBeforeRender };

import { PageContextServer } from "../../renderer/types";

async function onBeforeRender(pageContext: PageContextServer) {
  // const { octokit } = pageContext;
  let data = {};
  // if (octokit) data = (await octokit.request("GET /user")).data;
  // console.log(data, "88888");
  return {
    pageContext: {
      user: data,
    },
  };
}
