import React, { useRef } from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";
import { Link } from "./Link";
import { Layout } from "@components/Layout";
import { Content } from "@components/Content";
import { LightSidebar } from "@components/LightSidebar";
import { LinkButtonAtion, LinkButtonFunction } from "@type/linkButton";
import { Background } from "@components/Background";
import { useEffect } from "react";

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

  useEffect(() => {
    function isMobile() {
      const flag =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      return flag;
    }
    document.getElementsByTagName("html")[0].style.height = isMobile()
      ? "calc(100vh + 1px)"
      : "100vh";

    window.scrollTo(0, 1);
  }, []);

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
          <button
            onClick={() => document.querySelector("body")?.requestFullscreen()}
          >
            全屏
          </button>
        </LightSidebar>
        <Background />
      </PageContextProvider>
    </React.StrictMode>
  );
}
