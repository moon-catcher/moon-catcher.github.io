import { memo, useState } from "react";
import { isQuestionDotToken } from "typescript";
import "./FilePicker.less";

type Props = {
  open: boolean;
};

const FilePicker = (props: Props) => {
  const [fileList, setFileList] = useState([]);
  const [fileTree, setFileTree] = useState<object | undefined>();
  const showCode = async (item: any, index: number) => {
    const file = await item.fileHandle.getFile();
    const text = await file.text();
    codeText.value = text;
    currentIndex.value = index;
  };
  const openDir = async () => {
    const dirHandle = await window.showDirectoryPicker({});
    const out = await handleDirectoryEntry(dirHandle, {});
    setFileTree(out);
    console.log("--fileList--", fileList);
  };

  async function handleDirectoryEntry(
    dirHandle: FileSystemDirectoryHandle,
    out: { [prp: string]: object }
  ) {
    console.log(dirHandle.values(), "dirHandle");

    for await (const entry of dirHandle.values()) {
      console.log(entry, "entry");

      if (entry.kind === "file") {
        const file = await entry.getFile();
        out[file.name] = file;
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

  console.log(fileTree, "tree");

  return (
    <div className="FilePicker" style={{ flexBasis: props.open ? 400 : 0 }}>
      <div className="box">
        <button onClick={openDir}>打开文件</button>
        <button onClick={openDir}>打开文件夹</button>
        {JSON.stringify(fileTree)}
      </div>
    </div>
  );
};

export default memo(FilePicker);
