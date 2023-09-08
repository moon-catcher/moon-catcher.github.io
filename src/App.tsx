import { RouterProvider } from "react-router-dom";
import { memo, Suspense } from "react";
import { CounterProvider } from "@/providers/CounterProvider";
import { ProjectProvider } from "@/providers/ProjectProvider";
import createRootRouter from "@/router/router";
import "./App.less";

const App = () => {
  const router = createRootRouter();
  return (
    <div style={{ height: "100vh", padding: 16 }}>
      <CounterProvider>
        <ProjectProvider defaultProject={4}>
          <Suspense fallback={'loading...'}>
            <RouterProvider router={router} />
          </Suspense>
        </ProjectProvider>
      </CounterProvider>
    </div>
  );
};

export default memo(App);
