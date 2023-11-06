import logo from "/moon-catcher.png?url";
import "./Author.less";
import { useAuth } from "@providers/AuthProvider";
type Props = { showDetail: boolean };
export function Author({ showDetail }: Props) {
  const { userInfo, error } = useAuth();
  console.log(userInfo, error, "userInfo");

  return (
    <div className="author" style={showDetail ? {} : { padding: 10 }}>
      <div className="logo">
        <div className="login">
          <a
            href="/"
            style={
              showDetail
                ? { height: 100, width: 100 }
                : { height: 40, width: 40 }
            }
          >
            <div className={showDetail ? "rolling-bigger" : "rolling"}></div>
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
        </div>
      </div>
      <div className={["detail", showDetail ? "detail-hidden" : ""].join(" ")}>
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
        <div>博客文章</div>
        <div>博客文章</div>
        <div>博客文章</div>
      </div>
    </div>
  );
}
