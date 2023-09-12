import logo from "/mooncatcher.png?url";
import "./Author.less";
import { useAuth } from "@providers/AuthProvider";
type Props = { showDetail: boolean };
export function Author({ showDetail }: Props) {
  const { userInfo, login, loading } = useAuth();
  console.log(userInfo, "userInfo");

  return (
    <div className="author" style={showDetail ? {} : { padding: 10 }}>
      <div>
        <a href="/">
          <img
            src={(userInfo.avatar_url as string) ?? logo}
            alt="login"
            style={
              showDetail
                ? { height: 100, width: 100 }
                : { height: 40, width: 40 }
            }
          />
        </a>
        <button onClick={() => login()} hidden={!!userInfo.name}>
          点击登录{loading && ", loading..."}
        </button>
      </div>
      <div className="detail">
        <div>{userInfo.name}</div>
        <div
          style={
            showDetail
              ? {}
              : {
                  position: "absolute",
                  height: 0,
                  opacity: 0,
                  overflow: "hidden",
                }
          }
        >
          {userInfo.bio as string}
        </div>
        <div
          style={
            showDetail
              ? {}
              : {
                  position: "absolute",
                  height: 0,
                  opacity: 0,
                  overflow: "hidden",
                }
          }
        >
          link
        </div>
        <div
          style={
            showDetail
              ? {}
              : {
                  position: "absolute",
                  height: 0,
                  opacity: 0,
                  overflow: "hidden",
                }
          }
        >
          connect
        </div>
      </div>
      <div
        className="dashboard"
        style={showDetail ? {} : { opacity: 0, height: 0, overflow: "hidden" }}
      >
        <div>博客文章</div>
        <div>博客文章</div>
        <div>博客文章</div>
      </div>
      <div className="calendar">日历</div>
    </div>
  );
}
