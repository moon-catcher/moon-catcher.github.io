import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { Auth } from "./Auth";
type Props = {
  children: ReactNode;
  auth: Auth | (() => Auth);
};

type AuthContextValue = Auth | undefined;

const AuthContext1 = createContext<AuthContextValue>(undefined);

const AuthProvider1 = (props: Props) => {
  const [auth, setAuth] = useState(new Auth());
  useEffect(() => {
    console.log(props.auth, "props.auth");

    if (typeof props.auth === "function") {
      setAuth(props.auth());
    } else if (props.auth instanceof Auth) {
      setAuth(props.auth);
    }
  }, [props, props.auth]);

  console.log(auth, "auth");

  return (
    <AuthContext1.Provider value={auth}>{props.children}</AuthContext1.Provider>
  );
};

function useAuth() {
  const contextValue = useContext(AuthContext1);
  console.log(contextValue, "contextValue");

  if (!contextValue) {
    throw new Error("请在AuthProvider1中使用useAuth");
    // return new Auth();
  }
  return contextValue;
}

export { useAuth, AuthProvider1 };
