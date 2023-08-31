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
import { getCookie } from "@/utils/cookieUtils";
import { COOKIE_KEY_TOKEN } from "@/constant/auth";

type Props = {
  children: ReactNode;
  defaultUser?: string;
};

type AuthContextValue =
  | {
      changeUser: (userName: string) => void;
      login: () => void;
      userInfo: UserInfo;
      isLoading: boolean;
      isError: boolean;
    }
  | undefined;

const AuthContext = createContext<AuthContextValue>(undefined);

const AuthProvider = (props: Props) => {
  const cookieMapRef = useRef(new Map());

  // to set Defult User
  const [userId, setUserId] = useState<string>(props.defaultUser ?? "Jack");

  const userResponse = useQuery([USER_INFO], () => getUserInfo());
  const { isLoading, isError } = userResponse;
  const userInfo = userResponse?.data?.data ?? {};

  const login = useCallback(() => {}, []);
  const changeUser = useCallback((userName: string) => {
    setUserId(userName);
  }, []);

  const contextValue = useMemo(() => {
    return { login, changeUser, userInfo, isLoading, isError };
  }, [userInfo]);
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
