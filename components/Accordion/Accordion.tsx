import { IMemoCompoent } from "@type/index";
import React, {
  memo,
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
import "./Accordion.less";
import { OVERFLOWBAR_OPACITY } from "@constant/ui";

type Props = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  noTransition?: boolean;
  defaultClose?: boolean;
  onClick?: (event?: unknown) => void;
};

type AccordionContext =
  | [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  | undefined;

const defaultProps: Props = {
  icon: ">>",
  children: "empty",
  title: "title",
};

const Context = React.createContext<AccordionContext>(
  undefined as unknown as AccordionContext
);

const AccordionContextProvider = ({
  accordionContext,
  children,
}: {
  accordionContext: AccordionContext;
  children: React.ReactNode;
}) => {
  return (
    <Context.Provider value={accordionContext}>{children}</Context.Provider>
  );
};

const useAccordionContext = () => {
  const accordionContext = useContext(Context);
  if (!accordionContext) {
    throw new Error("AccordionContext Error");
  }
  return accordionContext;
};

const OriginAccordion = memo(function Accordion(props: Props) {
  const [collapseBoxOverflowHidden, setCollapseBoxOverflowHidden] =
    useState(false);

  // Children.map;
  return (
    <div className="accordion">
      <AccordionContextProvider
        accordionContext={[
          collapseBoxOverflowHidden,
          setCollapseBoxOverflowHidden,
        ]}
      >
        {props.children}
      </AccordionContextProvider>
    </div>
  );
});

const Collapse = memo(function Collapse(props: Props) {
  const [oepn, setOpen] = useState(!props.defaultClose);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const childrenRef = useRef<HTMLDivElement | null>(null);
  const childrenBoxRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [childHeight, setChildHeight] = useState<string | number>("unset");
  const [childBoxHeight, setChildBoxHeight] = useState<string | number>(
    "unset"
  );

  const [collapseBoxOverflowHidden, setCollapseBoxOverflowHidden] =
    useAccordionContext();

  const handleMouseLeave = useCallback((index: number) => {
    timeRef.current = setTimeout(() => {
      boxRef.current?.style.setProperty(OVERFLOWBAR_OPACITY, `${index * 0.1}`);
      if (index) handleMouseLeave(index - 1);
    }, 30);
  }, []);

  useEffect(() => {
    function handleTransitionEnd(event: TransitionEvent) {
      if (
        event.target instanceof HTMLDivElement &&
        event.target.className === "collapse-box"
      ) {
        setCollapseBoxOverflowHidden(false);
      }
    }
    function handleMouseOutOver(event: MouseEvent) {
      if (
        !boxRef.current
          ?.getElementsByClassName("collapse-box")[0]
          .contains(event.target as HTMLDivElement) &&
        !timeRef.current
      ) {
        handleMouseLeave(15);
      }
    }
    window.addEventListener("transitionend", handleTransitionEnd);
    window.addEventListener("mouseover", handleMouseOutOver);
    return () => {
      window.removeEventListener("transitionend", handleTransitionEnd);
      window.removeEventListener("mouseover", handleMouseOutOver);
    };
  }, [handleMouseLeave, setCollapseBoxOverflowHidden]);

  useEffect(() => {
    function onBoxResize() {
      if (childrenRef.current) {
        setChildHeight(childrenRef.current.clientHeight);
      }
    }
    function onChildBoxResize() {
      if (childrenBoxRef.current) {
        setChildBoxHeight(childrenBoxRef.current.offsetHeight);
      }
    }
    if (childrenRef.current) {
      const observer = new ResizeObserver(onBoxResize);
      observer.observe(childrenRef.current);
    }
    if (childrenBoxRef.current) {
      const observer = new ResizeObserver(onChildBoxResize);
      observer.observe(childrenBoxRef.current);
    }
  }, [props.children]);

  const handleHeaderClick = (event: unknown) => {
    setCollapseBoxOverflowHidden(true);
    setOpen((open) => !open);
    props.onClick?.(event);
  };

  const handleMouseOver = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }
    boxRef.current?.style.setProperty(OVERFLOWBAR_OPACITY, "1.5");
  };

  useEffect(() => {}, []);

  return (
    <div
      ref={boxRef}
      className="collapse"
      style={{
        flexShrink: Number(childHeight) < 50 ? 0 : 1,
      }}
    >
      <div onClick={handleHeaderClick} className="collapse-header">
        <div>{props.icon}</div>
        <div>{props.title}</div>
      </div>
      <div
        className="collapse-box"
        onMouseOver={handleMouseOver}
        ref={childrenBoxRef}
        style={{
          height: oepn ? childHeight : 0,
          overflow: collapseBoxOverflowHidden ? "hidden" : "auto",
          transition: props.noTransition ? undefined : "height 0.05s linear",
        }}
      >
        <div className="collapse-child" ref={childrenRef}>
          {props.children}
        </div>
      </div>
    </div>
  );
});

const Accordion: IMemoCompoent<Props> = Object.assign(OriginAccordion, {
  Collapse: Object.assign(Collapse, { defaultProps }),
});

export default Accordion;
