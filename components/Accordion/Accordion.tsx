import { IMemoCompoent } from "@type/index";
import React, { memo, useState, useRef, useEffect } from "react";
import "./Accordion.less";

type Props = {
  children: React.ReactNode;
};

const OriginAccordion = memo(function Accordion(props: Props) {
  return <div className="accordion">{props.children}</div>;
});

const Collapse = memo(function Collapse(props: Props) {
  const [oepn, setOpen] = useState(true);
  const childrenRef = useRef<HTMLDivElement | null>(null);
  const [boxHeight, setBoxHeight] = useState<string | number>("unset");
  const [collapseBoxOverflowHidden, setCollapseBoxOverflowHidden] =
    useState(false);

  useEffect(() => {
    if (childrenRef.current) {
      console.log(
        childrenRef.current.clientHeight,
        " childrenRef.current.clientHeight;"
      );
      setBoxHeight(childrenRef.current.clientHeight);
    }
    function handleTransitionEnd(event: TransitionEvent) {
      console.log(event);
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

  const handleHeaderClick = () => {
    setCollapseBoxOverflowHidden(true);
    setOpen((open) => !open);
  };

  return (
    <div
      className="collapse"
      style={{ flexShrink: Number(boxHeight) < 50 ? 0 : "auto" }}
    >
      <div onClick={handleHeaderClick}>header</div>
      <div
        className="collapse-box"
        style={{
          height: oepn ? boxHeight : 0,
          overflow: collapseBoxOverflowHidden ? "hidden" : "auto",
        }}
      >
        <div ref={childrenRef}>{props.children}</div>
      </div>
    </div>
  );
});

const Accordion: IMemoCompoent<Props> = Object.assign(OriginAccordion, {
  Collapse,
});
Accordion.Collapse = Collapse;

export default Accordion;
