import {
  Reducer,
  memo,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { isQuestionDotToken } from "typescript";
import "./FilePicker.less";

type Props = {
  open: boolean;
  defaultDirectory?: string;
};

const FilePicker = (props: Props) => {
  const [fileList, setFileList] = useState([]);
  const [tree, settree] = useState<object | undefined>();
  const [fileTree, dispatch] = useReducer(fileTreeReducer, {});
  const showCode = async (item: any, index: number) => {
    const file = await item.fileHandle.getFile();
    const text = await file.text();
    codeText.value = text;
    currentIndex.value = index;
  };

  const openDir = useCallback(
    async (defaultDirectory?: string) => {
      const dirHandle = await window.showDirectoryPicker({
        startIn: defaultDirectory,
      });
      const out = await handleDirectoryEntry(dirHandle, {});
      settree(out);
      console.log("--fileList--", fileList);
    },
    [fileList]
  );

  async function handleDirectoryEntry(
    dirHandle: FileSystemDirectoryHandle,
    out: { [prp: string]: object }
  ) {
    console.log(dirHandle.values(), "dirHandle");

    for await (const entry of dirHandle.values()) {
      console.log(entry, "entry");

      if (entry.kind === "file") {
        const file = await entry.getFile();
        if (file.name.endsWith(".md")) {
          out[file.name] = file;
        }
      }
      if (entry.kind === "directory") {
        console.log(entry.name, "entry.name");

        const newOut = (out[entry.name] = {});
        // if(){}
        // await handleDirectoryEntry(entry, newOut);
      }
    }
    return out;
  }

  console.log(tree, "tree");

  useEffect(() => {
    if (props.defaultDirectory) {
      openDir(props.defaultDirectory);
    }
  }, [openDir, props.defaultDirectory]);

  return (
    <div
      className={[
        "FilePicker",
        props.open ? "filepicker-show" : "filepicker-hidden",
      ].join(" ")}
    >
      <div className="box">
        <button onClick={() => openDir()}>本地文件保存路径</button>
        {JSON.stringify(tree)}
      </div>
    </div>
  );
};

type FileTreeState = { [d: string]: FileTreeState | File | undefined };
type FilePickerAction = {
  type: "expand" | " close" | "remove" | "move" | "create";
  preload: unknown;
};

const fileTreeReducer: Reducer<FileTreeState, FilePickerAction> = (
  treeState,
  action
) => {
  return treeState;
};

export default memo(FilePicker);
