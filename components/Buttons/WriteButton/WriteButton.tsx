import LinkButton from "../LinkButton/LinkButton";
import "./WriteButton.less";

const WriteButton = () => {
  return (
    <LinkButton className="writeButton" hiddenPath={"write"}>
      <a href="/write">🚀</a>
    </LinkButton>
  );
};

export default WriteButton;
