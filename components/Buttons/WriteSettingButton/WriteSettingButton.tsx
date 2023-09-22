import LinkButton from "../LinkButton/LinkButton";
import "./WriteSettingButton.less";

const WriteSettingButton = () => {
  return (
    <LinkButton className="writeSettingButton" showPath={"write"}>
      <a href="/write-setting">⚙</a>
    </LinkButton>
  );
};

export default WriteSettingButton;
