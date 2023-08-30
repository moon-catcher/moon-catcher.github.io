import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  NavLink,
  redirect,
  Route,
  RouterProvider,
  useLoaderData,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import { useAuth } from "./providers";
import "./App.less";
import { CounterProvider } from "./providers/CounterProvider";
import React, { memo, Suspense, useEffect, useRef, useState } from "react";
import { ProjectProvider } from "./providers/ProjectProvider";
import { Spin } from "antd";
import { getAccessToken } from "./api/github";
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

export type AccessToken = {
  token: string;
  token_type: string;
  scope: string;
  error?: Error;
};
const Auth = () => {
  const code = useLoaderData() as string;
  const cookieMapRef = useRef(new Map());
  const navigate = useNavigate();
  const [status, setStatus] = useState("正在校验登录状态...");

  useEffect(() => {}, [code]);

  useEffect(() => {
    document.cookie.split(";").forEach((cookie) => {
      const [key, value] = cookie.split("=");
      cookieMapRef.current.set(String(key).trim(), value);
    });
    console.log(cookieMapRef.current, "cookieMapRef.current");

    const authCode = cookieMapRef.current.get("AuthCode");
    console.log(
      "cookieCode:",
      authCode,
      "code",
      code,
      !!code,
      code !== "undefined",
      code.toString(),
      "=============="
    );

    if (!!code && authCode !== code) {
      setStatus("登录中...");
      getAccessToken(code)
        .then(({ data }: { data: AccessToken }) => {
          console.log(data, "datadatadatadata");
          if (data.error) {
            return Promise.reject(data.error);
          } else {
            document.cookie = `Authorization=Bearer ${data?.token}`;
            document.cookie = `AuthCode=${code}`;
            apiClient.defaults.headers[
              "Authorization"
            ] = `Bearer ${data?.token}`;
            setStatus("登录成功,3s即将自动跳转...点击立即跳转");
          }
        })
        .catch((error) => {
          console.log(error, "error");

          setStatus("登录失败,点击重试");
        });
    } else {
      const authorization = cookieMapRef.current.get("Authorization");
      console.log(authorization, "authorization", cookieMapRef.current);

      if (authorization) {
        apiClient.defaults.headers["Authorization"] = authorization;
        setStatus("已登录");
      }
    }
  }, [code]);

  useEffect(() => {
    if (status === "登录成功,3s即将自动跳转...点击立即跳转") {
      setTimeout(() => {
        setStatus(`登录成功,2s即将自动跳转...点击立即跳转`);
      }, 1000);
    }
    if (status === "登录成功,2s即将自动跳转...点击立即跳转") {
      setTimeout(() => {
        setStatus(`登录成功,1s即将自动跳转...点击立即跳转`);
      }, 1000);
    }
    if (status === "登录成功,1s即将自动跳转...点击立即跳转") {
      setTimeout(() => {
        setStatus(`登录成功,0s即将自动跳转...点击立即跳转`);
      }, 1000);
    }
    if (status === "登录成功,0s即将自动跳转...点击立即跳转") {
      navigate("/home");
    }
  }, [status]);

  console.log(
    apiClient.defaults.headers["Authorization"],
    `apiClient.defaults.headers[
    "Authorization"
  ]`
  );

  return (
    <>
      <span>{status}</span>
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

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
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

          <Route
            index
            loader={() => {
              const params = new URL(window.location.href).searchParams;
              const code = params.get("code");
              if (code) {
                return redirect(`/auth`);
              }
              console.log(code, "code");

              return null;
            }}
            element={<Navigate to={"/list"} />}
          />
        </Route>
        <Route
          path="/auth"
          loader={() => {
            const params = new URL(window.location.href).searchParams;
            const code = params.get("code");
            console.log(code, "code");
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
