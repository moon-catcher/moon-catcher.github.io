import "./Layout.less";
export function Layout({ children }: { children: React.ReactNode }) {
  return <div className="layout">{children}</div>;
}
