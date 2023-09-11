import { Author } from "@components/Author/Author";
import { Counter } from "@components/Counter";
import { HorizontalBox } from "@components/HorizontalBox";
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

  return (
    <>
      <Author />
      <HorizontalBox>
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
      </HorizontalBox>
      <div className="footer">
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
      </div>
    </>
  );
}
