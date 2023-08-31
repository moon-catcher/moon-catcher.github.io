import {
  createBrowserRouter,
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  NavLink,
  redirect,
  Route,
} from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { lazy } from "react";

const Auth = lazy(() => import("@/views/Auth/Auth"));
const Home = lazy(() => import("@/views/Home/Home"));
const LazyLoadDemo = lazy(() => import("@/views/LazyLoadDemo"));
const ErrorBoundary = lazy(() => import("@/views/ErrorBoundary/ErrorBoundary"));
const Dashboard = lazy(() => import("@/components/Dashboard"));
const CounterPage = lazy(() => import("@/components/CounterPage"));
const CounterXPage = lazy(() => import("@/components/CounterXPage"));
const ProjectDetail = lazy(() => import("@/components/ProjectDetail"));
const ProjectDetailMobx = lazy(
  () => import("@/components/ProjectDetail/ProjectDetailMobx")
);
const StoryList = lazy(
  () => import("@/views/LazyLoadDemo/components/StoryList/StoryList")
);
const Gantt = lazy(() => import("@/views/LazyLoadDemo/components/Gantt/Gantt"));
const Manhour = lazy(
  () => import("@/views/LazyLoadDemo/components/Manhour/Manhour")
);

const createRootRouter = () => {
  // 在这里使用context里的数据
  const { userInfo, isLoading } = useAuth();
  const createMyRouter =
    import.meta.env.MODE === "gh" ? createHashRouter : createBrowserRouter;
  const router = createMyRouter(
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
  return router;
};

export default createRootRouter;
