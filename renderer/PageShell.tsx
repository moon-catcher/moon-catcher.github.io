import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";
import { Link } from "./Link";
import { Layout } from "@components/Layout";
import { Content } from "@components/Content";
import { LightSidebar } from "@components/LightSidebar";

export { PageShell };

function PageShell({
  children,
  pageContext,
}: {
  children: React.ReactNode;
  pageContext: PageContext;
}) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Layout>
          <Content>{children}</Content>
        </Layout>
        <LightSidebar>
          <Link className="navitem" href="/">
            Home
          </Link>
          <Link className="navitem" href="/blog">
            Blog
          </Link>
          <Link className="navitem" href="/about">
            About
          </Link>
        </LightSidebar>
      </PageContextProvider>
    </React.StrictMode>
  );
}
