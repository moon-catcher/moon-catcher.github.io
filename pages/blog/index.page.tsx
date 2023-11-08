import { Author } from "@components/Author/Author";
import { useCallback, useState, useEffect } from "react";
import { Counter } from "@components/Counter";
import "./index.less";
import { usePageContext } from "../../renderer/usePageContext";

export { Page };
export const documentProps = {
  // title 和 description 会覆盖默认值
  title: "Welcome Moon Catcher!",
};
const articles = new Array(100).fill(0).map((_, index) => ({
  name: "Name" + index,
  content: "啊发射点发的发射点发萨法沙发沙发沙发",
}));

function Page() {
  const [showAuthorDetail, setShowAuthorDetail] = useState(true);
  const [touchStart, setTouchStart] = useState(0);

  const { setLinkBntAction } = usePageContext();

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      console.log(event);
      setShowAuthorDetail(event.touches[0].clientY > touchStart);
    },
    [touchStart]
  );
  const handleTouchStart = (event: TouchEvent) => {
    setTouchStart(event.touches[0].clientY);
  };

  const handleSearch = useCallback((searchValue: string) => {
    console.log("search", searchValue, "searchValue");
  }, []);

  const handleWeel = useCallback((event: unknown) => {
    const { wheelDeltaY } = event as { wheelDeltaY: number };
    if (wheelDeltaY < 0) {
      setShowAuthorDetail(false);
    } else {
      setShowAuthorDetail(true);
    }
  }, []);

  useEffect(() => {
    if (typeof setLinkBntAction === "function") {
      setLinkBntAction<string>("search", handleSearch);
    }
  }, [setLinkBntAction, handleSearch]);

  useEffect(() => {
    document.addEventListener("wheel", handleWeel);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchstart", handleTouchStart);
  }, []);

  return (
    <>
      <Author showDetail={showAuthorDetail} />
      <div
        className="article-list"
        style={{
          height: `calc(100% - ${showAuthorDetail ? "174px" : "60px"}) `,
        }}
      >
        <div className="article-box">
          <h1>Welcome</h1>
          This page is:
          <ul>
            <li>Rendered to HTML.</li>
            <li>
              Interactive. <Counter />
            </li>
          </ul>
        </div>
        {articles.map(({ name, content }) => {
          return (
            <div key={name} className="article-box">
              <h1>{name}</h1>
              <p>{content}</p>
            </div>
          );
        })}
      </div>
      {/* <div className="footer">
        <div className="hot-article">
          <div>热门文章</div>
          <div>热门文章</div>
          <div>热门文章</div>
        </div>
        <div className="categories">
          <div>分类一</div>
          <div>分类一</div>
          <div>分类一</div>
        </div>
      </div> */}
    </>
  );
}
