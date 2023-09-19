/// <reference types="vite/client" />
declare interface Window {
  clear: boolean;
  [prop: string]: ((token: string) => void) | undefined;
}
declare module "escape-html" {
  export = (string: string) => string;
}
