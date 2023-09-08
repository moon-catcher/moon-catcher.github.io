import {
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  NavLink,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { lazy } from "react";

const GithubLogin = lazy(() => import("@/views/GithubLogin/GithubLogin"));
const Home = lazy(() => import("@/views/Home/Home"));
const ErrorBoundary = lazy(() => import("@/views/ErrorBoundary/ErrorBoundary"));
const Dashboard = lazy(() => import("@/components/Dashboard"));
const CounterPage = lazy(() => import("@/components/CounterPage"));
const CounterXPage = lazy(() => import("@/components/CounterXPage"));
const ProjectDetail = lazy(() => import("@/components/ProjectDetail"));
const ProjectDetailMobx = lazy(
  () => import("@/components/ProjectDetail/ProjectDetailMobx")
);

const createRootRouter = () => {
  // 在这里使用context里的数据
  const { userInfo, isLoading } = useAuth();
  const createMyRouter = import.meta.env.MODE.includes("gh")
    ? createHashRouter
    : createBrowserRouter;
  const router = createMyRouter(
    createRoutesFromElements(
      <Route
        path="/"
        errorElement={
          <>
            404 <NavLink to="/">返回首页</NavLink>
          </>
        }
        element={<Navigate to={"/home"} />}
      >
        <Route
          path="/auth"
          loader={() => {
            const params = new URL(window.location.href).searchParams;
            const code = params.get("code");
            const state = params.get("state");
            const error = params.get("error");
            return { code, state, error };
          }}
          element={<GithubLogin />}
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
  return router;
};

export default createRootRouter;
