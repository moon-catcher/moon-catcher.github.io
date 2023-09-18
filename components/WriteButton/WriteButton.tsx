import React from "react";
import "./WriteButton.less";
import { Link } from "../../renderer/Link";
type Props = {};

const WriteButton = (props: Props) => {
  return (
    <div className="writeButton">
      <Link className="navitem" href="/write">
        🚀
      </Link>
    </div>
  );
};

export default WriteButton;
