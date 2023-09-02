export const getCookie = (cookieKey: string) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=").map((item) => String(item).trim());
    if (cookieKey === key) {
      return value;
    }
  }
};
