import apiClient from "@/api/apiClient";
import { getAccessToken } from "@/api/github";
import octokit, { updateOctokitToken } from "@/api/octokitClient";
import {
  COOKIE_KEY_CODE,
  COOKIE_KEY_TOKEN,
  LOGIN_TEXT_CHECKING,
  LOGIN_TEXT_FAILED,
  LOGIN_TEXT_LOADING,
  LOGIN_TEXT_LOGINED,
} from "@/constant/auth";
import { useAuth } from "@/providers/AuthProvider";
import { AccessToken } from "@/types";
import { getCookie, setCookie } from "@/utils/cookieUtils";
import dayjs from "dayjs";
import { memo, useEffect, useRef, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";

const Auth = () => {
  const code = useLoaderData() as string;
  const navigate = useNavigate();
  const timer = useRef<NodeJS.Timeout>();
  const [status, setStatus] = useState(LOGIN_TEXT_CHECKING);

  const timesText = (times: number) =>
    `登录成功,${times}s即将自动跳转...点击立即跳转`;

  useEffect(() => {
    const authCode = getCookie(COOKIE_KEY_CODE);
    if (!!code && authCode !== code) {
      setCookie({ key: COOKIE_KEY_CODE, value: code });
      setStatus(LOGIN_TEXT_LOADING);
      getAccessToken(code)
        .then(async ({ data }: { data: AccessToken }) => {
          if (!data || data.error) {
            return Promise.reject(data?.error ?? "token 请求失败");
          } else {
            setCookie({ key: COOKIE_KEY_TOKEN, value: data.token });
            updateOctokitToken();
            const data2 = await octokit.request("GET /user", {
              headers: {
                "X-GitHub-Api-Version": "2022-11-28",
              },
            });
            console.log(data2, octokit);
          }
        })
        .catch((error) => {
          console.error(error);
          setStatus(LOGIN_TEXT_FAILED);
        });
    } else {
      const authorization = getCookie(COOKIE_KEY_TOKEN);
      if (authorization) {
        setStatus(LOGIN_TEXT_LOGINED);
      } else {
        setStatus(LOGIN_TEXT_FAILED);
      }
    }
  }, [code]);

  useEffect(() => {
    if (status === timesText(3)) {
      timer.current = setTimeout(() => {
        setStatus(timesText(2));
      }, 1000);
    }
    if (status === timesText(2)) {
      timer.current = setTimeout(() => {
        setStatus(timesText(1));
      }, 1000);
    }
    if (status === timesText(1)) {
      timer.current = setTimeout(() => {
        setStatus(timesText(0));
      }, 1000);
    }
    if (status === timesText(0)) {
      navigate("/home");
    }
    return () => {
      clearTimeout(timer.current);
    };
  }, [status]);

  return (
    <>
      <span>{status}</span>
      <NavLink to={"/home"}>返回首页</NavLink>
    </>
  );
};

export default memo(Auth);
