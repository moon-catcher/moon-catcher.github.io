import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { UserInfo } from "@/types";
// import { getUserInfo } from "@/api/user";
import { USER_INFO } from "@/constant/api";
import { getUserInfo } from "@/api/github";
import apiClient from "@/api/apiClient";
import { Octokit } from "octokit";
import octokit from "@/api/octokitClient";
import { getCookie, setCookie } from "@/utils/cookieUtils";
import { COOKIE_KEY_TOKEN } from "@/constant/auth";
import { randomString } from "@/utils/stringUtils";
import dayjs from "dayjs";

type Props = {
  children: ReactNode;
  defaultUser?: string;
};

type AuthContextValue =
  | {
      userInfo: UserInfo;
      token: string;
    } & any;

const AuthContext = createContext<AuthContextValue>(undefined);

const AuthProvider = (props: Props) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState("");
  const childWindowColseTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const token = getCookie(COOKIE_KEY_TOKEN);
    if (token) {
      setToken(token);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const octokit = new Octokit({
        auth: token,
      });
      octokit
        .request("GET /user", {
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        })
        .then((res: any) => {
          setUserInfo(res.data);
        });
    }
  }, [token]);

  const logout = useCallback(() => {
    setCookie({
      key: COOKIE_KEY_TOKEN,
      value: "",
      exexpiresDay: dayjs().add(-1, "day"),
    });
    setToken("");
    setUserInfo("");
  }, []);

  const login = useCallback((loginUser?: string) => {
    const state = randomString(Math.floor(Math.random() * 100 + 32));
    const params = {
      client_id: import.meta.env.vite_client_id,
      login: loginUser ?? "",
      scope: import.meta.env.vite_github_scope, // write:repo_hook,
      state,
      redirect_uri: import.meta.env.vite_github_auth_url,
    };

    setLoading(true);
    const childWindow = window.open(
      `https://github.com/login/oauth/authorize?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")}&tokfn=${state}`,
      "_blank",
      "height=600, width=500, left=800,top=100"
    );
    window[`${state}`] = (token: string) => {
      clearInterval(childWindowColseTimer.current);
      setToken(token);
      setLoading(false);
      delete window[`${state}`];
      childWindow?.close();
    };

    if (childWindow) {
      childWindowColseTimer.current = setInterval(function () {
        if (childWindow?.closed) {
          clearInterval(childWindowColseTimer.current);
          setLoading(false);
          delete window[`${state}`];
        }
      }, 1000);
    }
  }, []);
  const changeUser = useCallback(() => {}, []);

  const contextValue = useMemo(() => {
    return {
      login,
      changeUser,
      setUserInfo,
      userInfo,
      setToken,
      token,
      loading,
      logout,
    };
  }, [
    login,
    changeUser,
    setUserInfo,
    userInfo,
    setToken,
    token,
    loading,
    logout,
  ]);
  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const contextValue = useContext(AuthContext);
  if (!contextValue) {
    throw new Error("请在AuthProvider中使用useAuth");
  }
  return contextValue;
}

export { useAuth, AuthProvider };
