import { Button, MenuProps, Menu, Spin } from "antd";
import React, { useState, Suspense } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./LazyLoadDemo.less";
const TestDrawer = React.lazy(
  () => import("./components/TestDrawer/TestDrawer")
);
const TestDrawer2 = React.lazy(
  () => import("./components/TestDrawer2/TestDrawer")
);
const navLinkClass = ({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) => {
  return isPending ? "pending" : isActive ? "active" : "";
};
const items: MenuProps["items"] = [
  {
    label: (
      <NavLink to={"list"} className={navLinkClass}>
        列表
      </NavLink>
    ),
    key: "list",
  },
  {
    label: (
      <NavLink to={"gantt"} className={navLinkClass}>
        甘特图
      </NavLink>
    ),
    key: "gantt",
  },
  {
    label: (
      <NavLink to={"manhour"} className={navLinkClass}>
        人力分配
      </NavLink>
    ),
    key: "manhour",
  },
  {
    label: <div>需求详情页</div>,
    key: "storyDetail",
  },
  {
    label: <div>需求详情页2</div>,
    key: "storyDetail2",
  },
];

const LazyLoadDemo = () => {
  const { pathname } = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpen2, setDrawerOpen2] = useState(false);

  const [current, setCurrent] = useState(
    (items.find((item) => pathname.includes(item?.key as string))
      ?.key as string) ?? "list"
  );
  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
    if (e.key === "storyDetail") {
      setDrawerOpen(true);
    }
    if (e.key === "storyDetail2") {
      //   start(() => {
      setDrawerOpen2(!drawerOpen2);
      //   });
    }
  };

  return (
    <div>
      <div style={{ fontSize: 30, textAlign: "center" }}>React Lazy Demo</div>
      <NavLink className={navLinkClass} to="/home">
        <Button>to Home</Button>
      </NavLink>
      <Menu
        onClick={onClick}
        selectedKeys={[current]}
        mode="horizontal"
        items={items}
      />
      <Suspense fallback={<Spin />}>
        <Outlet />
      </Suspense>
      <Suspense
        fallback={
          <Spin>
            <div style={{ fontSize: 30, height: 100, textAlign: "center" }}>
              加载中
            </div>
          </Spin>
        }
      >
        {drawerOpen2 && <TestDrawer2 />}
        {drawerOpen && (
          <TestDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
        )}
      </Suspense>
    </div>
  );
};

export default LazyLoadDemo;
