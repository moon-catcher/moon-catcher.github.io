import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import App from "./App";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import octokit from "./api/octokitClient";
import { getCookie } from "./utils/cookieUtils";
import { COOKIE_KEY_TOKEN } from "./constant/auth";
import { OctokitProvider } from "./providers/OctokitProvider";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <OctokitProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </OctokitProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
