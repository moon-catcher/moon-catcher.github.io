import LinkButton from "../LinkButton/LinkButton";
import "./SearchButton.less";

type Props = { onClick?: (searchValue: string) => void };

const SearchButton = (props: Props) => {
  return (
    <LinkButton
      className="searchButton"
      hiddenPath={"write"}
      onClick={() => props.onClick?.("adf")}
    >
      🔎
    </LinkButton>
  );
};

export default SearchButton;
