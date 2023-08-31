import { RouterProvider } from "react-router-dom";
import { memo, Suspense, useEffect, useRef } from "react";
import { CounterProvider } from "@/providers/CounterProvider";
import { ProjectProvider } from "@/providers/ProjectProvider";
import { Spin } from "antd";
import apiClient from "@/api/apiClient";
import createRootRouter from "@/router/router";
import "./App.less";

const App = () => {
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

  const router = createRootRouter();

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
