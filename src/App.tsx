import {
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  NavLink,
  redirect,
  Route,
  RouterProvider,
  useLoaderData,
  useRouteError,
} from "react-router-dom";
import { useAuth } from "./providers";
import "./App.less";
import { CounterProvider } from "./providers/CounterProvider";
import React, { memo, Suspense, useEffect, useRef, useState } from "react";
import { ProjectProvider } from "./providers/ProjectProvider";
import { Spin } from "antd";
import { getAccessToken } from "./api/github";
import { useQuery } from "@tanstack/react-query";
import apiClient from "./api/apiClient";

const LazyLoadDemo = React.lazy(() => import("./components/LazyLoadDemo"));

const Home = React.lazy(() => import("./components/Home/Home"));

const Dashboard = React.lazy(() => import("./components/Dashboard"));

const CounterPage = React.lazy(() => import("./components/CounterPage"));
const CounterXPage = React.lazy(() => import("./components/CounterXPage"));
const ProjectDetail = React.lazy(() => import("./components/ProjectDetail"));
const ProjectDetailMobx = React.lazy(
  () => import("./components/ProjectDetail/ProjectDetailMobx")
);

const StoryList = React.lazy(
  () => import("./components/LazyLoadDemo/components/StoryList/StoryList")
);
const Gantt = React.lazy(
  () => import("./components/LazyLoadDemo/components/Gantt/Gantt")
);

const Manhour = React.lazy(
  () => import("./components/LazyLoadDemo/components/Manhour/Manhour")
);

const ErrorBoundary = () => {
  const error = useRouteError() as Error;
  return <>{error.message}</>;
};

type AccessToken = {
  access_token: string;
  token_type: string;
  scope: string;
};
const Auth = () => {
  const code = useLoaderData() as string;
  const codeSetRef = useRef(new Set());
  const cookieMapRef = useRef(new Map());
  const [expires, setExpires] = useState(false);

  const authResponse = useQuery<{ data: AccessToken }>(
    ["auth-code", code],
    async () => await getAccessToken(code),
    {
      enabled: !!code && expires,
      staleTime: 60000 * 24 * 3,
    }
  );

  const data = authResponse?.data?.data;
  console.log(data, "datadatadatadata");

  useEffect(() => {
    if (data?.access_token) {
      codeSetRef.current.add(code);
      document.cookie = `Authorization=${data.token_type} ${data?.access_token};`;
      setExpires(false);
      apiClient.defaults.headers[
        "Authorization"
      ] = `Bearer ${data?.access_token}`;
    }
  }, [data]);

  useEffect(() => {
    if (!codeSetRef.current.has(code)) {
      setExpires(true);
    }
  }, [code]);

  useEffect(() => {
    document.cookie.split("; ").forEach((cookie) => {
      const [key, value] = cookie.split("=");
      cookieMapRef.current.set(key, value);
    });
    const authorization = cookieMapRef.current.get("Authorization");
    if (authorization) {
      apiClient.defaults.headers["Authorization"] = authorization;
    } else {
      setExpires(true);
    }
  }, []);

  console.log(
    apiClient.defaults.headers["Authorization"],
    `apiClient.defaults.headers[
    "Authorization"
  ]`
  );
  const isLogined = !!apiClient.defaults.headers["Authorization"];

  return (
    <>
      {authResponse.isError && "登录失败,点击"}
      {authResponse.isFetching && "登录中..."}
      {data?.access_token
        ? "登录成功,即将自动跳转...点击"
        : isLogined
        ? "已登录"
        : "正在校验登录状态..."}
      <NavLink to={"/home"}>返回首页</NavLink>
    </>
  );
};

const App = () => {
  console.log("进入程序");
  const cookieMapRef = useRef(new Map());
  useEffect(() => {
    document.cookie.split("; ").forEach((cookie) => {
      const [key, value] = cookie.split("=");
      cookieMapRef.current.set(key, value);
    });
    const authorization = cookieMapRef.current.get("Authorization");
    if (authorization) {
      apiClient.defaults.headers["Authorization"] = authorization;
    }
  }, []);

  // 在这里使用context里的数据
  const { userInfo, isLoading } = useAuth();
  // 不要结构使用mobx的action

  const myRouter = import.meta.env.DEV ? createBrowserRouter : createHashRouter;
  const router = createHashRouter(
    createRoutesFromElements(
      <Route
        path="/"
        loader={async ({ request }) => {
          const params = new URL(request.url).searchParams;
          const code = params.get("code");
          if (code) {
            return redirect(`/auth`);
          }
          return null;
        }}
        errorElement={
          <>
            404 <NavLink to="/">返回首页</NavLink>
          </>
        }
      >
        <Route path="/" element={<LazyLoadDemo />}>
          <Route path="/list" element={<StoryList />} />
          <Route path="/gantt" element={<Gantt />} />
          <Route path="/manhour" element={<Manhour />} />

          <Route index element={<Navigate to={"/list"} />} />
        </Route>
        <Route
          path="/auth"
          loader={async ({ request }) => {
            const code = new URL(request.url).searchParams.get("code");
            console.log(code, "code", request);
            return code;
          }}
          element={<Auth />}
        />
        <Route
          path="/home"
          // element={<div style={{ fontSize: 150 }}>Welcome!</div>}
          element={<Home />}
        >
          <Route
            index
            element={<div style={{ fontSize: 150 }}>Welcome!</div>}
          />
          <Route
            path="/home/dashboard/:id"
            element={<Dashboard />}
            // 注意!: 不要在Route 的 loader 和 action 中使用上下文相关hooks : useContext以及依赖他实现的hook
            loader={({ params }) => {
              if (
                userInfo.dashboard instanceof Array &&
                userInfo.dashboard.includes(Number(params.id))
              ) {
                return Promise.resolve(userInfo);
              }
              throw new Error("无权限");
            }}
            errorElement={isLoading ? <>Loading...</> : <ErrorBoundary />}
          />
          <Route
            path="/home/counter/:counterNumber?"
            element={<CounterPage />}
          />
          <Route
            path="/home/counterX/:counterNumber?"
            element={<CounterXPage />}
          />
          <Route path="/home/project/:projectId?" element={<ProjectDetail />} />
          <Route
            path="/home/project-mobx/:projectId?"
            element={<ProjectDetailMobx />}
          />
        </Route>
      </Route>
    )
  );
  return (
    <div style={{ height: "100vh", padding: 16 }}>
      <CounterProvider>
        <ProjectProvider defaultProject={4}>
          <Suspense fallback={<Spin />}>
            <RouterProvider router={router} />
          </Suspense>
        </ProjectProvider>
      </CounterProvider>
    </div>
  );
};

export default memo(App);
