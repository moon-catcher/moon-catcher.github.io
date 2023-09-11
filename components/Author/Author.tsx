import logo from "/mooncatcher.png?url";
import "./Author.less";
import { useAuth } from "@providers/AuthProvider";
export function Author() {
  const { userInfo, login, loading } = useAuth();
  console.log(userInfo, "userInfo");

  return (
    <div className="author">
      <div>
        <a href="/">
          <img
            src={(userInfo.avatar_url as string) ?? logo}
            height={100}
            width={100}
            alt="login"
          />
        </a>
        <button onClick={() => login()} hidden={!!userInfo.name}>
          点击登录{loading && ", loading..."}
        </button>
      </div>
      <div className="detail">
        <div>{userInfo.name}</div>
        <div>{userInfo.bio as string}</div>
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
