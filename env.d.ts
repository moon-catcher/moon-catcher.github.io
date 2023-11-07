/// <reference types="vite/client" />

type directoryPickerOption = {
  id?: string;
  mode?: string;
  startIn?: string;
};

declare interface FileSystemSyncAccessHandle {
  close: () => undefined;
  flush: () => undefined;
  getSize: () => number;
  truncate: (newSize: number) => undefined;
  read: (
    buffer: ArrayBuffer | ArrayBufferView,
    options?: { at: number }
  ) => number;
  write: (
    buffer: ArrayBuffer | ArrayBufferView,
    options?: { at: number }
  ) => number;
}

declare interface FileSystemFileHandle {
  createSyncAccessHandle: () => Promise<FileSystemSyncAccessHandle>;
}

declare interface FileSystemDirectoryHandle {
  values: () => (FileSystemDirectoryHandle | FileSystemFileHandle)[];
}
