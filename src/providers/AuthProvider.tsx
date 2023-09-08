import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { UserInfo } from "@/types";
import { getCookie, setCookie } from "@/utils/cookieUtils";
import {
  COOKIE_KEY_AUTH,
  COOKIE_KEY_CODE,
  COOKIE_KEY_STATE,
} from "@/constant/auth";
import { randomString } from "@/utils/stringUtils";
import { Octokit } from "octokit";
import { loginByAuth } from "@/api/user";
import dayjs from "dayjs";
type Props = {
  children: ReactNode;
  defaultUser?: string;
};

type AuthContextValue =
  | ({
      userInfo: UserInfo;
      token: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } & { [props: string]: any })
  | undefined;

const AuthContext = createContext<AuthContextValue>(undefined);

const AuthProvider = (props: Props) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [octokit, setOctokit] = useState<Octokit | undefined>();
  const childWindowColseTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const code = getCookie(COOKIE_KEY_CODE);
    const state = getCookie(COOKIE_KEY_STATE);
    const authkey = localStorage.getItem(COOKIE_KEY_AUTH);
    if (authkey && code && state) {
      setLoading(true);
      loginByAuth({
        code,
        state,
        authkey: JSON.parse(authkey),
      })
        .then(
          (res: { data: { status: number; msg: string; token: string } }) => {
            setToken(res.data.token);
          }
        )
        .finally(() => {
          setLoading(false);
        });
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
        .then((res: { data: object }) => {
          setUserInfo(res.data);
        });
      setOctokit(octokit);
    }
  }, [token]);

  const logout = useCallback(() => {
    setCookie(COOKIE_KEY_CODE, "", {
      expires: dayjs().add(-1, "day").toDate().toUTCString(),
    });
    setCookie(COOKIE_KEY_STATE, "", {
      expires: dayjs().add(-1, "day").toDate().toUTCString(),
    });
    setCookie(COOKIE_KEY_AUTH, "", {
      expires: dayjs().add(-1, "day").toDate().toUTCString(),
    });
    setOctokit(undefined);
    setUserInfo({});
  }, []);

  const login = useCallback((loginUser?: string) => {
    const state = randomString(Math.floor(Math.random() * 10 + 12));
    // 发起登录请求之前，保存state 到cookie
    setCookie(COOKIE_KEY_STATE, state, {
      expires: dayjs().add(3, "day").toDate().toUTCString(),
    });
    const params = {
      client_id: import.meta.env.vite_client_id,
      login: loginUser ?? "",
      scope: import.meta.env.vite_github_scope, // write:repo_hook,
      state,
      redirect_uri: import.meta.env.vite_github_auth_url,
    };

    setLoading(true);
    if (!import.meta.env.SSR) {
      const childWindow = window.open(
        `https://github.com/login/oauth/authorize?${Object.entries(params)
          .map(([key, value]) => `${key}=${value}`)
          .join("&")}&tokfn=${state}`,
        "_blank",
        "height=600, width=500, left=800,top=100, location=false"
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
    }
  }, []);

  const contextValue = useMemo(() => {
    return {
      token,
      octokit,
      userInfo,
      loading,
      login,
      logout,
      setToken,
      setUserInfo,
    };
  }, [userInfo, token, loading, octokit]);
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
