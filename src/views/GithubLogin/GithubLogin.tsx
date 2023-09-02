import { getAccessToken, putCookie } from "@/api/github";
import {
  COOKIE_KEY_AUTH,
  COOKIE_KEY_CODE,
  GITHUB_LOGIN_CANCEL,
  LOGIN_TEXT_CANCEL,
  LOGIN_TEXT_CHECKING,
  LOGIN_TEXT_FAILED,
  LOGIN_TEXT_LOADING,
  LOGIN_TEXT_LOGINED,
  LOGIN_TEXT_UNLOGINED,
} from "@/constant/auth";
import { useAuth } from "@/providers/AuthProvider";
import { AccessToken } from "@/types";
import { getCookie } from "@/utils/cookieUtils";
import dayjs from "dayjs";
import { memo, useEffect, useState } from "react";
import { NavLink, useLoaderData } from "react-router-dom";

const Auth = () => {
  const { code, state, error } = useLoaderData() as {
    code: string;
    state: string;
    error: string;
  };
  const { setToken } = useAuth();
  const [status, setStatus] = useState(LOGIN_TEXT_CHECKING);

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
    const expires = dayjs().add(3, "day").toDate().toUTCString();
    // url中的state和cookie中的相同，则进行登录操作

    if (!!code && authCode !== code) {
      setStatus(LOGIN_TEXT_LOADING);
      getAccessToken(code, state)
        .then(async ({ data }: { data: AccessToken }) => {
          if (data?.token) {
            await putCookie({
              [COOKIE_KEY_CODE]: code,
              expires,
            });
            setToken(data.token);
            setStatus(LOGIN_TEXT_LOGINED);
            window.opener[`${state}`](data.token);
            window.opener = undefined;
          }
        })
        .catch((error: Error) => {
          if (error.message === "Request aborted") return;
          console.error(error.message);
          setStatus(LOGIN_TEXT_FAILED);
          window.opener = undefined;
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
  }, [code, state]);

  return (
    <>
      <span>{status}</span>
      <NavLink to={"/home"}>返回首页</NavLink>
    </>
  );
};

export default memo(Auth);
