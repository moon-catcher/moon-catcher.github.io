export type { PageContextServer };
export type { PageContextClient };
export type { PageContext };
export type { PageProps };
import { LinkButtonAtion, LinkButtonFunction } from "@type/linkButton";
import { UserInfo } from "@type/user";

import type {
  PageContextBuiltInServer,
  /*
  // When using Client Routing https://vite-plugin-ssr.com/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient
  /*/
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient,
  //*/
} from "vite-plugin-ssr/types";

type Page = (pageProps: PageProps) => React.ReactElement;
type PageProps = Record<string, unknown>;

export type PageContextCustom = {
  Page: Page;
  pageProps?: PageProps;
  urlPathname: string;
  exports: {
    documentProps?: {
      title?: string;
      description?: string;
      background?: string;
    };
  };
};

type PageContextServer = PageContextBuiltInServer<Page> & PageContextCustom;
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom;

type PageContext = (PageContextClient | PageContextServer) & {
  setLinkBntAction?: <T>(
    key: LinkButtonAtion,
    fc: LinkButtonFunction<T>
  ) => void;
  user?: UserInfo;
};
