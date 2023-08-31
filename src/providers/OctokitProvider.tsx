import React, {
  createContext,
  useContext,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";
import { Octokit } from "octokit";

type Props = {
  children: ReactNode;
};

type OctokitContextValue = {} | undefined;
const OctokitContext = createContext<OctokitContextValue>(undefined);

const OctokitProvider = (props: Props) => {
  const [octokit, setOctokit] = useState<Octokit>();
  const { token } = useAuth();
  useEffect(() => {
    if (token) {
      const octokit = new Octokit({
        auth: token,
      });
      setOctokit(octokit);
      octokit.auth
    }
  }, [token]);
  return (
    <OctokitContext.Provider value={octokit}>
      {props.children}
    </OctokitContext.Provider>
  );
};
function useOctokit() {
  const contextValue = useContext<OctokitContextValue>(OctokitContext);
  if (!contextValue) {
    throw new Error("请在OctokitProvider中使用useOctokit");
  }
  return contextValue;
}

export { OctokitProvider, useOctokit };
