import { useEffect, useState } from "react";
import "./LinkButton.less";
type Props = {
  children: React.ReactNode;
  hiddenPath?: string | string[];
  showPath?: string | string[];
  className?: string;
  onClick?: () => void;
};

const LinkButton = (props: Props = { children: "🚀", hiddenPath: [] }) => {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    if (props.hiddenPath?.length) {
      if (
        (typeof props.hiddenPath === "string" &&
          location.pathname.includes(props.hiddenPath)) ||
        (typeof props.hiddenPath === "object" &&
          props.hiddenPath.some((path) => location.pathname.includes(path)))
      ) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    } else if (props.showPath?.length) {
      if (
        (typeof props.showPath === "string" &&
          location.pathname.includes(props.showPath)) ||
        (typeof props.showPath === "object" &&
          props.showPath.some((path) => location.pathname.includes(path)))
      ) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } else {
      setShowButton(true);
    }
  }, [props.hiddenPath, props.showPath]);

  if (!showButton) {
    return <></>;
  }

  return (
    <div
      className={["action-button", props.className].join(" ")}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  );
};

export default LinkButton;
