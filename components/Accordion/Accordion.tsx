import { IMemoCompoent } from "@type/index";
import React, { memo, useState, useRef, useEffect } from "react";
import "./Accordion.less";
import { OVERFLOWBAR_OPACITY } from "@constant/ui";

type Props = {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  noAnimate?: boolean;
};

const defaultProps: Props = {
  icon: ">>",
  children: "empty",
  title: "title",
};

const OriginAccordion = memo(function Accordion(props: Props) {
  return <div className="accordion">{props.children}</div>;
});

const Collapse = memo(function Collapse(props: Props) {
  const [oepn, setOpen] = useState(true);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const childrenRef = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const [boxHeight, setBoxHeight] = useState<string | number>("unset");
  const [collapseBoxOverflowHidden, setCollapseBoxOverflowHidden] =
    useState(false);

  useEffect(() => {
    function handleTransitionEnd(event: TransitionEvent) {
      if (
        event.target instanceof HTMLDivElement &&
        event.target.className === "collapse-box"
      ) {
        setCollapseBoxOverflowHidden(false);
      }
    }
    window.addEventListener("transitionend", handleTransitionEnd);
    return () => {
      window.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, []);

  useEffect(() => {
    if (childrenRef.current) {
      setBoxHeight(childrenRef.current.clientHeight);
    }
  }, [props.children]);

  const handleHeaderClick = () => {
    setCollapseBoxOverflowHidden(true);
    setOpen((open) => !open);
  };

  const handleMouseOver = () => {
    boxRef.current?.style.setProperty(OVERFLOWBAR_OPACITY, "1");
  };

  const handleMouseLeave = (index: number) => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      timeRef.current = null;
    }
    timeRef.current = setTimeout(() => {
      boxRef.current?.style.setProperty(OVERFLOWBAR_OPACITY, `${index * 0.1}`);
      if (index) handleMouseLeave(index - 1);
    }, 40);
  };

  useEffect(() => {}, []);

  return (
    <div
      ref={boxRef}
      className="collapse"
      style={{ flexShrink: Number(boxHeight) < 150 ? 0 : "auto" }}
    >
      <div onClick={handleHeaderClick} className="collapse-header">
        <div>{props.icon}</div>
        <div>{props.title}</div>
      </div>
      <div
        className="collapse-box"
        onMouseOver={handleMouseOver}
        onMouseLeave={() => handleMouseLeave(15)}
        style={{
          height: oepn ? boxHeight : 0,
          overflow: collapseBoxOverflowHidden ? "hidden" : "auto",
          transition: props.noAnimate ? undefined : "all 0.1s linear",
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
