/// <reference types="vite/client" />
declare interface Window {
  clear: boolean;
  [prop: string]: ((token: string) => void) | undefined;
}
