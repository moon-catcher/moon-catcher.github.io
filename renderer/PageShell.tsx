import React from "react";
import { PageContextProvider } from "./usePageContext";
import type { PageContext } from "./types";
import "./PageShell.css";
import { Link } from "./Link";
import { Sidebar } from "@components/Sidebar";
import { Layout } from "@components/Layout";
import { Content } from "@components/Content";
import { Logo } from "@components/Logo";

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
          <Sidebar>
            <Logo />
            <Link className="navitem" href="/">
              Home
            </Link>
            <Link className="navitem" href="/about">
              About
            </Link>
          </Sidebar>
          <Content>{children}</Content>
        </Layout>
      </PageContextProvider>
    </React.StrictMode>
  );
}



