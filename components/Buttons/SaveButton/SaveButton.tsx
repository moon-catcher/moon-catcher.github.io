import LinkButton from "../LinkButton/LinkButton";
import "./SaveButton.less";

const SaveButton = () => {
  return (
    <LinkButton className="saveButton" showPath={"write"}>
      <a href="javascript:void(0)">📌</a>
    </LinkButton>
  );
};

export default SaveButton;
