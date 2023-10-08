export { render };
// See https://vite-plugin-ssr.com/data-fetching
export const passToClient = [
  "pageProps",
  "urlPathname",
  "setLinkBntAction",
  "user",
];
// export { onBeforeRender };
// import { Octokit } from "@octokit/action";
import ReactDOMServer from "react-dom/server";
import logo from "/moon-catcher.png?url";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import type { PageContextServer } from "./types";
import { Background } from "@components/Background";
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

  const background =
    (documentProps && documentProps.background) ||
    ReactDOMServer.renderToString(<Background />);

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href=${logo} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${desc}" />
        <!-- webApp全屏显示，IOS设备 -->
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <!-- 通用的浏览器 -->
        <meta name='full-screen' content='true' />
        <!-- QQ浏览器（X5内核）独有的META -->
        <meta name='x5-fullscreen' content='true' />
        <!-- 360浏览器独有的 -->
        <meta name='360-fullscreen' content='true' />
        <title>${title}</title>
      </head>
      <body>
        <div id="react-root">${dangerouslySkipEscape(pageHtml)}</div>
        <div id="background">${dangerouslySkipEscape(background)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      // We can add some `pageContext` here, which is useful if we want to do page redirection https://vite-plugin-ssr.com/page-redirection
    },
  };
}
