import { Dayjs } from "dayjs";

export const getCookie = (cookieKey: string) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=").map((item) => String(item).trim());
    if (cookieKey === key) {
      return value;
    }
  }
};

type setCookieParams = { key: string; value: string; exexpiresDay?: Dayjs };

export const setCookie = ({ key, value, exexpiresDay }: setCookieParams) => {
  if (exexpiresDay) {
    const expires = exexpiresDay.toDate().toUTCString();
    document.cookie = `${key}=${value}; expires=${expires}`;
  } else {
    document.cookie = `${key}=${value}`;
  }
};
