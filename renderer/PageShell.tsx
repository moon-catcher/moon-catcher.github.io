import React, {  useRef } from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";
import { Link } from "./Link";
import { Layout } from "@components/Layout";
import { Content } from "@components/Content";
import { LightSidebar } from "@components/LightSidebar";
import { LinkButtonAtion, LinkButtonFunction } from "@type/linkButton";

export { PageShell };

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sidebarRef = useRef<{
    functionMap: Map<LinkButtonAtion, LinkButtonFunction>;
  } | null>(null);

  function setLinkBntAction<T>(
    key: LinkButtonAtion,
    fc: LinkButtonFunction<T>
  ) {
    sidebarRef.current?.functionMap.set(key, fc);
  }

  return (
    <React.StrictMode>
      <PageContextProvider pageContext={{ ...pageContext, setLinkBntAction }}>
        <Layout>
          <Content>{children}</Content>
        </Layout>
        <LightSidebar ref={sidebarRef}>
          <Link className="navitem" href="/">
            Home
          </Link>
          <Link className="navitem" href="/blog">
            Blog
          </Link>
          <Link className="navitem" href="/about">
            About
          </Link>
          <Link className="navitem" href="/write">
            Write
          </Link>
          <Link className="navitem" href="/draft">
            Draft
          </Link>
        </LightSidebar>
      </PageContextProvider>
    </React.StrictMode>
  );
}
