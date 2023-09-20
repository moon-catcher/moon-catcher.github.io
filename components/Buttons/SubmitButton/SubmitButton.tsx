import LinkButton from "../LinkButton/LinkButton";
import "./SubmitButton.less";

type Props = { onClick?: () => void };

const SubmitButton = (props: Props) => {
  return (
    <LinkButton
      className="submitButton"
      showPath={"write"}
      onClick={props.onClick}
    >
      🎈
    </LinkButton>
  );
};

export default SubmitButton;
