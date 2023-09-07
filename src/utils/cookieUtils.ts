export const getCookie = (cookieKey: string) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=").map((item) => String(item).trim());
    if (cookieKey === key) {
      return value;
    }
  }
};

export const setCookie = (
  cookieKey: string,
  value: string,
  options?: { [prop: string]: string }
) => {
  if (options) {
    const optionStr = Object.entries(options)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
    document.cookie = `${cookieKey}=${value}; ${optionStr}; domain=${
      options.domain ?? import.meta.env.vite_domain
    }`;
  } else {
    document.cookie = `${cookieKey}=${value}; domain=${
      import.meta.env.vite_domain
    }`;
  }
};
