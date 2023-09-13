import { Author } from "@components/Author/Author";
import { useCallback, useEffect, useRef, useState } from "react";
import { Counter } from "@components/Counter";
import "./index.less";

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
  const [scrollTop, setScrollTop] = useState(0);
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleScroll = useCallback(
    (
      event: React.UIEvent<HTMLDivElement> & { target: { scrollTop: number } }
    ) => {
      clearTimeout(timer.current);
      console.log(event);

      setShowAuthorDetail(scrollTop > event.target.scrollTop);
      timer.current = setTimeout(() => {
        setScrollTop(event.target.scrollTop);
      }, 0);
    },
    [scrollTop]
  );

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  return (
    <>
      <Author showDetail={showAuthorDetail} />
      <div
        className="article-list"
        // onWheel={handleWheel}
        onScroll={handleScroll}
        style={{
          height: `calc(100vh - ${
            showAuthorDetail ? "174px" : "60px"
          } - 40px) `,
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
