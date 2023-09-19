import React, { useRef, useEffect } from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";
import { Link } from "./Link";
import { Layout } from "@components/Layout";
import { Content } from "@components/Content";
import { LightSidebar } from "@components/LightSidebar";
import { AuthProvider } from "../providers/AuthProvider";

export { PageShell };

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const sidebarRef = useRef<{ setSaveFc: (_fc: () => void) => void } | null>(
    null
  );
  console.log(sidebarRef.current?.setSaveFc);
  useEffect(() => {
    sidebarRef.current?.setSaveFc(() => () => console.log(888888888));
  }, []);

  return (
    <React.StrictMode>
      <AuthProvider>
        <PageContextProvider pageContext={{ ...pageContext, sidebarRef }}>
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
      </AuthProvider>
    </React.StrictMode>
  );
}
