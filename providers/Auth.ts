import { loginByAuth } from "@api/user";
import {
  COOKIE_KEY_AUTH,
  COOKIE_KEY_CODE,
  COOKIE_KEY_STATE,
  DEFAULT_HEADER,
} from "@constant/auth";
import { UserInfo } from "@type/user";
import { getCookie, setCookie } from "@utils/cookieUtils";
import { randomString } from "@utils/stringUtils";
import dayjs from "dayjs";
import { Octokit } from "octokit";

export class Auth {
  loading = false;
  token = "";
  error = "";
  userInfo: UserInfo = {};
  octokit?: Octokit;
  childWindowColseTimer: NodeJS.Timeout | null = null;
  constructor() {
    this.authToken();
  }

  get code() {
    return getCookie(COOKIE_KEY_CODE);
  }

  get state() {
    console.log(222222222222222);

    return getCookie(COOKIE_KEY_STATE);
  }

  get authkey() {
    return localStorage.getItem(COOKIE_KEY_AUTH);
  }

  authToken() {
    const { authkey, code, state } = this;
    if (authkey && code && state) {
      this.loading = true;
      loginByAuth({
        code,
        state,
        authkey: JSON.parse(authkey),
      })
        .then(
          (res: { data: { status: number; msg: string; token: string } }) => {
            if (!res.data.status) {
              console.log(res.data.token, "res.data.token");

              this.token = res.data.token;
              this.getUserInfo();
            } else {
              this.error = res.data.msg;
            }
          }
        )
        .catch((error) => {
          this.error = error.message;
        });
    } else {
      this.error = "未登录";
    }
  }

  getUserInfo() {
    const { token, loading } = this;
    if (token && loading) {
      const octokit = new Octokit({
        auth: token,
      });
      octokit
        .request("GET /user", {
          headers: DEFAULT_HEADER,
        })
        .then((res: { data: object }) => {
          this.userInfo = res.data as UserInfo;
          this.loading = false;
          this.error = "";
        })
        .catch((error) => {
          this.error = error.message;
        });
      this.octokit = octokit;
    }
  }
  logout() {
    setCookie(COOKIE_KEY_CODE, "", {
      expires: dayjs().add(-1, "day").toDate().toUTCString(),
    });
    setCookie(COOKIE_KEY_STATE, "", {
      expires: dayjs().add(-1, "day").toDate().toUTCString(),
    });
    setCookie(COOKIE_KEY_AUTH, "", {
      expires: dayjs().add(-1, "day").toDate().toUTCString(),
    });
    this.octokit = undefined;
    this.userInfo = {};
  }

  login(loginUser?: string) {
    const state = randomString(Math.floor(Math.random() * 10 + 12));
    // 发起登录请求之前，保存state 到cookie
    setCookie(COOKIE_KEY_STATE, state, {
      expires: dayjs().add(3, "day").toDate().toUTCString(),
    });
    const params = {
      client_id: import.meta.env.vite_client_id,
      login: loginUser ?? "",
      scope: import.meta.env.vite_github_scope, // write:repo_hook,
      state,
      redirect_uri: import.meta.env.vite_github_auth_url,
    };

    this.loading = true;
    this.error = "";
    const childWindow = window.open(
      `https://github.com/login/oauth/authorize?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join("&")}&tokfn=${state}`,
      "_blank",
      "height=600, width=500, left=800,top=100, location=false"
    );

    window[`${state}`] = (token: string) => {
      if (this.childWindowColseTimer) clearInterval(this.childWindowColseTimer);
      this.token = token;
      this.error = "";
      delete window[`${state}`];
      childWindow?.close();
    };

    if (childWindow) {
      this.childWindowColseTimer = setInterval(() => {
        if (childWindow?.closed) {
          if (this.childWindowColseTimer)
            clearInterval(this.childWindowColseTimer);
          this.error = "取消登录";
          delete window[`${state}`];
        }
      }, 1000);
    }
  }
}
