import logo from "/mooncatcher.png?url";
import "./Author.less";
export function Author() {
  return (
    <div className="author">
      <a href="/">
        <img src={logo} height={150} width={150} alt="author" />
      </a>
      <div className="detail">
        <div>name</div>
        <div>
          key words666666666666666666666666666666666666666666666666666666666
        </div>
        <div>link</div>
        <div>connect</div>
      </div>
      <div className="dashboard">
        <div>博客文章</div>
        <div>博客文章</div>
        <div>博客文章</div>
      </div>
      <div className="calendar">日历</div>
    </div>
  );
}
