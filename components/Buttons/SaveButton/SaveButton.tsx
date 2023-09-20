import LinkButton from "../LinkButton/LinkButton";
import "./SaveButton.less";

type Props = { onClick?: () => void };

const SaveButton = (props: Props) => {
  return (
    <LinkButton
      className="saveButton"
      showPath={"write"}
      onClick={props.onClick}
    >
      📌
    </LinkButton>
  );
};

export default SaveButton;
