import { PageContext } from "../../renderer/types";

export default (pageContext: PageContext) => {
  // We can use RegExp / any library we want

  if (
    !["auth", "code", "state"].every((param) =>
      pageContext.urlPathname.includes(param)
    )
  ) {
    return false;
  }
  // const params = new URL(pageContext.urlOriginal).searchParams;
  const paramStr = pageContext.urlOriginal?.replace(/\/auth\?*/, "");
  const queryArray = paramStr?.split("&");
  const result: { [prop: string]: string } = {};
  queryArray?.map((query: string) => {
    // param=value 以 = 分割
    const temp = query.split("=");
    if (temp.length > 1) {
      // 收集参数
      result[temp[0] as string] = temp[1];
    }
  });

  return {
    // Make `id` available as pageContext.routeParams.id
    routeParams: result,
  };
};
