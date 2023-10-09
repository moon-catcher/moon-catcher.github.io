import React, { useEffect, useRef } from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";
import { Link } from "./Link";
import { Layout } from "@components/Layout";
import { Content } from "@components/Content";
import { LightSidebar } from "@components/LightSidebar";
import { LinkButtonAtion, LinkButtonFunction } from "@type/linkButton";
import { Background } from "@components/Background";
import { MobileFullscreen, type IMaskProps } from "react-mobile-fullscreen";

export { PageShell };

const Mask = (props: IMaskProps) => {
  return (
    <div
      style={{
        background: props.fullscreenType === "native" ? "blue" : "green",
        width: "100%",
        height: "100%",
      }}
    >
      {props.fullscreenType === "native"
        ? "Click Me!"
        : props.fullscreenType === "minimal-ui"
        ? "Swipe Up!"
        : "Mask won't be rendered"}
    </div>
  );
};

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

  // useEffect(() => {
  //   document.onclick = function () {
  //     if (document.fullscreenElement) {
  //       document.exitFullscreen();
  //     } else {
  //       document.documentElement.requestFullscreen();
  //     }
  //   };
  // }, []);

  return (
    <React.StrictMode>
      <MobileFullscreen mask={Mask}>
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
          <Background />
        </PageContextProvider>
      </MobileFullscreen>
    </React.StrictMode>
  );
}
