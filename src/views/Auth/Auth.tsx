import apiClient from "@/api/apiClient";
import { getAccessToken } from "@/api/github";
import {
  LOGIN_TEXT_CHECKING,
  LOGIN_TEXT_FAILED,
  LOGIN_TEXT_LOADING,
  LOGIN_TEXT_LOGINED,
} from "@/constant/auth";
import { AccessToken } from "@/types";
import { memo, useEffect, useRef, useState } from "react";
import { NavLink, useLoaderData, useNavigate } from "react-router-dom";

const Auth = () => {
  const code = useLoaderData() as string;
  const cookieMapRef = useRef(new Map());
  const navigate = useNavigate();
  const timer = useRef<NodeJS.Timeout>();
  const [status, setStatus] = useState(LOGIN_TEXT_CHECKING);

  const timesText = (times: number) =>
    `登录成功,${times}s即将自动跳转...点击立即跳转`;

  useEffect(() => {
    document.cookie.split(";").forEach((cookie) => {
      const [key, value] = cookie.split("=");
      cookieMapRef.current.set(String(key).trim(), value);
    });

    const authCode = cookieMapRef.current.get("AuthCode");
    console.log("authCode", authCode, "code", code);

    if (!!code && authCode !== code) {
      document.cookie = `AuthCode=${code}`;
      setStatus(LOGIN_TEXT_LOADING);
      getAccessToken(code)
        .then(({ data }: { data: AccessToken }) => {
          if (data.error) {
            return Promise.reject(data.error);
          } else {
            document.cookie = `Authorization=Bearer ${data?.token}`;
            apiClient.defaults.headers[
              "Authorization"
            ] = `Bearer ${data?.token}`;
            setStatus(timesText(3));
          }
        })
        .catch((error) => {
          console.error(error);
          setStatus(LOGIN_TEXT_FAILED);
        });
    } else {
      const authorization = cookieMapRef.current.get("Authorization");
      if (authorization) {
        apiClient.defaults.headers["Authorization"] = authorization;
        setStatus(LOGIN_TEXT_LOGINED);
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
