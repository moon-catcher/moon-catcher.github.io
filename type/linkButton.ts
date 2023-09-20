export type LinkButtonAtion = "save" | "submit" | "search";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LinkButtonFunction<T = any> = (..._arg: T[]) => void;
