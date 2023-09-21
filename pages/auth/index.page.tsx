import { getAccessToken } from "@api/github";
import {
  COOKIE_KEY_AUTH,
  COOKIE_KEY_CODE,
  COOKIE_KEY_STATE,
  GITHUB_LOGIN_CANCEL,
  LOGIN_TEXT_CANCEL,
  LOGIN_TEXT_CHECKING,
  LOGIN_TEXT_FAILED,
  LOGIN_TEXT_LOADING,
  LOGIN_TEXT_LOGINED,
  LOGIN_TEXT_UNLOGINED,
} from "@constant/auth";
import { AccessToken } from "@type/user";
import { getCookie, setCookie } from "@utils/cookieUtils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link } from "../../renderer/Link";
import { useAuth } from "@providers/AuthProvider";
export { Page };
function Page() {
  const { setToken } = useAuth();
  const [code, setCode] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(LOGIN_TEXT_CHECKING);

  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const code = params.get("code");
    const state = params.get("state");
    const error = params.get("error");
    setCode(code ?? "");
    setState(state ?? "");
    setError(error ?? "");
  }, []);

  useEffect(() => {
    if (error) {
      window.opener = undefined;
      if (error === GITHUB_LOGIN_CANCEL) {
        setStatus(LOGIN_TEXT_CANCEL);
      } else {
        setStatus(LOGIN_TEXT_FAILED);
      }
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, [error]);

  useEffect(() => {
    const authCode = getCookie(COOKIE_KEY_CODE);
    const authState = getCookie(COOKIE_KEY_STATE);

    const expires = dayjs().add(3, "day").toDate().toUTCString();
    // url中的state和cookie中的相同，则进行登录操作

    console.log(code, authCode, state, authCode, "**************");

    if (!!code && authCode !== code && authState === state) {
      setStatus(LOGIN_TEXT_LOADING);
      getAccessToken(code, state)
        .then(async ({ data }: { data: AccessToken }) => {
          if (data?.token) {
            setCookie(COOKIE_KEY_CODE, code, {
              expires,
            });
            localStorage.setItem(COOKIE_KEY_AUTH, JSON.stringify(data.authkey));
            setToken(data.token);
            setStatus(LOGIN_TEXT_LOGINED);
            const callback = window.opener[`${state}`];
            window.opener = undefined;
            setTimeout(() => {
              callback(data.token);
            }, 1000);
          }
        })
        .catch((error: Error) => {
          if (error.message === "Request aborted") return;
          setStatus(LOGIN_TEXT_FAILED);
          // window.opener = undefined;
          setTimeout(() => {
            window.close();
          }, 1000);
        });

      // cookie中的
    } else if (code && code === authCode) {
      const authkey = getCookie(COOKIE_KEY_AUTH);
      if (authkey) {
        setStatus(LOGIN_TEXT_LOGINED);
      } else {
        setStatus(LOGIN_TEXT_UNLOGINED);
      }
    }
  }, [code, setToken, state]);

  return (
    <>
      <span>{status}</span>
      <Link href={"/blog"}>返回首页</Link>
    </>
  );
}
