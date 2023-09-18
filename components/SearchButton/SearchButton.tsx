import { useState, useEffect } from "react";
import "./SearchButton.less";

const SearchButton = () => {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    if (location.pathname.includes("blog")) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  }, []);
  if (!showButton) {
    return <></>;
  }

  return <div className="searchButton">🔍</div>;
};

export default SearchButton;
