import LinkButton from "../LinkButton/LinkButton";
import "./SearchButton.less";

const SearchButton = () => {
  return (
    <LinkButton className="searchButton" hiddenPath={"write"}>
      🔍
    </LinkButton>
  );
};

export default SearchButton;
