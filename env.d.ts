/// <reference types="vite/client" />

type directoryPickerOption = {
  id?: string;
  mode?: string;
  startIn?: string;
};

declare interface FileSystemDirectoryHandle {
  values: () => (FileSystemDirectoryHandle | FileSystemFileHandle)[];
}

declare interface Window {
  showDirectoryPicker: (
    directoryPickerOption
  ) => Promise<FileSystemDirectoryHandle> | never;
  [prop: string]: ((token: string) => void) | undefined;
}
declare module "escape-html" {
  export = (string: string) => string;
}
