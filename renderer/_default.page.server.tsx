export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  "pageProps",
  "urlPathname",
  "setLinkBntAction",
  "user",
  "handle",
];
// export { onBeforeRender };
// import { Octokit } from "@octokit/action";
import ReactDOMServer from "react-dom/server";
import logo from "/moon-catcher.png?url";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import type { PageContextServer } from "./types";
import { AuthProvider } from "@providers/AuthProvider";

async function render(pageContext: PageContextServer) {
  const { Page, pageProps } = pageContext;
  //  if (import.meta.env.GITHUB_TOKEN) {
  //   console.log(888);

  //   console.log(
  //     import.meta.env.GITHUB_TOKEN,
  //     "GITHUB_AUTHOR",
  //     import.meta.env.GITHUB_AUTHOR,
  //     "GITHUB_REPOSITORY",
  //     import.meta.env.GITHUB_REPOSITORY
  //   );

  // const { data } = await octokit.request(
  //   "GET /repos/{owner}/{repo}/contents/{path}",
  //   {
  //     owner: "moon-catcher",
  //     repo: "moon-catcher.github.io",
  //     path: "blog/articles",
  //     headers: DEFAULT_HEADER,
  //   }
  // );
  // console.log(data, "77777777777");
  // const { data: user } = await octokit.request("GET /users/{user}", {
  //   user: import.meta.env.GITHUB_AUTHOR,
  //   headers: DEFAULT_HEADER,
  // });
  // console.log(user, "888");
  // }
  // This render() hook only supports SSR, see https://vite-plugin-ssr.com/render-modes for how to modify render() to support SPA
  if (!Page)
    throw new Error("My render() hook expects pageContext.Page to be defined");
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const pageHtml = ReactDOMServer.renderToString(
    <AuthProvider>
      <PageShell pageContext={pageContext}>
        <Page {...pageProps} />
      </PageShell>
    </AuthProvider>
  );

  // See https://vite-plugin-ssr.com/head
  const { documentProps } = pageContext.exports;
  const title =
    (documentProps && documentProps.title) || import.meta.env.vite_title;
  const desc =
    (documentProps && documentProps.description) || import.meta.env.vite_desc;

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en" data-color-mode="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="browsermode" content="application">
        <meta name="full-screen" content="yes" />
        <meta name="x5-fullscreen" content="true" />
        <meta name="x5-page-mode" content="app" />
        <meta name="360-fullscreen" content="true" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="description" content="${desc}" />
        <link rel="manifest" href="/moon-catcher.json" />
        <link rel="icon" href=${logo} />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
