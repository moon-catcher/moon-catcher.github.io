import { RichEditor } from "@components/RichEditor";
import "./index.less";
import { useAuth } from "@providers/AuthProvider";

export { Page };
function Page() {
  const { userInfo, error, login } = useAuth();
  return (
    <div className="write-page">
      {userInfo.login ? (
        <RichEditor />
      ) : (
        <h3 className="login">
          {!error ? (
            "校验登录..."
          ) : (
            <span title="点击登录" onClick={() => login()}>
              未登录, 点击登录
            </span>
          )}
        </h3>
      )}
    </div>
  );
}
