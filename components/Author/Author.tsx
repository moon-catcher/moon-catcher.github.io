import logo from "/mooncatcher.png?url";
import "./Author.less";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useLayoutEffect, useState } from "react";
import { UserInfo } from "@type/user";
type Props = { showDetail: boolean };
export function Author({ showDetail }: Props) {
  const { userInfo: remoteUserInfo, login, loading, error } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  console.log(userInfo, "userInfo");

  useLayoutEffect(() => {
    const userInfoStr = localStorage.getItem("LOCAL_USERINFO");
    console.log(userInfoStr, "userInfoStr");
    if (userInfoStr) setUserInfo(JSON.parse(userInfoStr) as UserInfo);
  }, []);

  useEffect(() => {
    if (remoteUserInfo.name && !error) {
      setUserInfo(remoteUserInfo);
      localStorage.setItem("LOCAL_USERINFO", JSON.stringify(remoteUserInfo));
    } else if (error) {
      setUserInfo({});
      localStorage.setItem("LOCAL_USERINFO", "");
    }
  }, [remoteUserInfo, error]);

  return (
    <div className="author" style={showDetail ? {} : { padding: 10 }}>
      <div>
        {userInfo.avatar_url ? (
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
        ) : (
          <div
            className="login"
            title="点击登录"
            onClick={() => !loading && login()}
          >
            <div
              className="login-text"
              style={showDetail ? { fontSize: 16 } : { fontSize: 8 }}
            >
              {loading ? "登录中..." : (error && "未登录") || "校验中..."}
            </div>
            <div className={showDetail ? "loading-bigger" : "loading"}></div>
            <img
              src={logo}
              alt="login"
              style={
                showDetail
                  ? { height: 100, width: 100 }
                  : { height: 40, width: 40 }
              }
            />
          </div>
        )}
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
