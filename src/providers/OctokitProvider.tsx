import { createContext, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type OctokitContextValue = {} | undefined;

const OctokitContext = createContext(undefined);

const OctokitProvider = (props: Props) => {
  return (
    <OctokitContext.Provider value={undefined}>
      {props.children}
    </OctokitContext.Provider>
  );
};

export { OctokitProvider };
