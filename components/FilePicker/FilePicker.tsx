import {
  Reducer,
  memo,
  useMemo,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import "./FilePicker.less";
import Accordion from "@components/Accordion/Accordion";
import { uniqueId } from "lodash";

type Props = {
  open: boolean;
  handleFileContentChange?: (value: string) => void;
};

const FilePicker = (props: Props) => {
  const [localLoading, setLocalLoading] = useState(false);
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [draftDirHandle, setDraftDirHandle] =
    useState<FileSystemDirectoryHandle | null>(null);
  const [showTypes, setShowTypes] = useState({
    remoteDraft: true,
    localDraft: true,
    published: false,
  });
  const [fileTree, dispatch] = useReducer(fileTreeReducer, {});
  const showFileContent = async (file: File) => {
    const text = await file.text();
    console.log(text);
    props.handleFileContentChange?.(text);
  };

  async function handleDirectoryEntry(
    dirHandle: FileSystemDirectoryHandle,
    out: { [prp: string]: object } = {},
    pid?: string
  ) {
    console.log(pid, "", "dirHandle");

    for await (const entry of dirHandle.values()) {
      console.log(entry, "entry");

      if (entry.kind === "file") {
        const file = await entry.getFile();
        out[pid ? pid + file.name : file.name] = {
          kind: "file",
          file,
          name: file.name,
          handle: entry,
          id: uniqueId("FilePicker_"),
          pid,
        };
      }
      if (entry.kind === "directory") {
        console.log(entry.name, "entry.name");

        // const newOut = (out[entry.name] = {});
        out[pid ? pid + entry.name : entry.name] = {
          kind: "directory",
          name: entry.name,
          handle: entry,
          id: uniqueId("FilePicker_"),
          pid,
        };
        // if(){}
        // await handleDirectoryEntry(entry, newOut);
      }
    }
    return out;
  }

  console.log("//////////////////");

  const initDraftDirHandle = useCallback(async () => {
    setLocalLoading(() => true);
    const draftDirHandle = await window.showDirectoryPicker({});
    setDraftDirHandle(draftDirHandle);
    const out = await handleDirectoryEntry(draftDirHandle);
    console.log(out, "outoutout");

    dispatch({
      type: "create",
      preload: out,
    });
    setLocalLoading(() => false);
  }, []);

  const handleShowTypesChange = useCallback((key: string, checked: boolean) => {
    setShowTypes((old) => ({ ...old, [key]: checked }));
  }, []);

  // useEffect(() => {
  //   if (draftDirHandle) {
  //     setInterval(() => {
  //       handleDirectoryEntry(draftDirHandle, {}).then((out) => {
  //         settree(out);
  //       });
  //     }, 500);
  //   }
  // }, [draftDirHandle]);
  const handleFileClick = async (item: FileTreeItem) => {
    showFileContent(item.file!);
  };

  const handleDirectoryClick = async (item: FileTreeItem) => {
    const state = await handleDirectoryEntry(
      item.handle as FileSystemDirectoryHandle,
      {},
      item.id
    );
    console.log(state, "state");
    dispatch({ type: "append", preload: state });
  };

  return (
    <div
      className={[
        "FilePicker",
        props.open ? "filepicker-show" : "filepicker-hidden",
      ].join(" ")}
    >
      <div className="filepicker-box">
        <div className="filepicker-header">
          <div className="filepicker-tab">Articles</div>
          <div className="filepicker-footer">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="filepicker-remote-draft"
                checked={showTypes.remoteDraft}
                onChange={(event) =>
                  handleShowTypesChange("remoteDraft", event.target.checked)
                }
              />
              <label htmlFor="filepicker-remote-draft" className="check-button">
                在线草稿
              </label>
              <input
                type="checkbox"
                id="filepicker-local-draft"
                checked={showTypes.localDraft}
                onChange={(event) =>
                  handleShowTypesChange("localDraft", event.target.checked)
                }
              />
              <label htmlFor="filepicker-local-draft" className="check-button">
                本地草稿
              </label>
              <input
                type="checkbox"
                id="filepicker-published"
                checked={showTypes.published}
                onChange={(event) =>
                  handleShowTypesChange("published", event.target.checked)
                }
              />
              <label htmlFor="filepicker-published" className="check-button">
                已发布
              </label>
            </div>
          </div>
        </div>
        {}
        <div className="filepicker-draft-box">
          <Accordion>
            {showTypes.remoteDraft && (
              <Accordion.Collapse title={"在线草稿"}>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
                <div>9999</div>
              </Accordion.Collapse>
            )}
            {showTypes.localDraft && (
              <Accordion.Collapse title={"本地草稿"}>
                {draftDirHandle ? (
                  <>
                    <RowItems
                      tree={fileTree}
                      handleDirectoryClick={handleDirectoryClick}
                      handleFileClick={handleFileClick}
                    />
                    {/* {Object.values(fileTree ?? {})
                      .filter((item) => !item.pid)
                      .map((item, index) => {
                        const { kind, name, file } = item;
                        if (file && kind === "file") {
                          return (
                            <div
                              key={name + index}
                              onClick={() => handleFileClick(item)}
                            >
                              {name}
                            </div>
                          );
                        }
                        return (
                          <Accordion.Collapse
                            key={name + index}
                            title={
                              <div
                                onClick={() => {
                                  console.log(fileTree, "fileTree");
                                  handleDirectoryClick(item);
                                }}
                              >
                                {" > "}
                                {name}
                              </div>
                            }
                          ></Accordion.Collapse>
                        );
                      })} */}
                  </>
                ) : (
                  <button onClick={initDraftDirHandle}>打开文件夹</button>
                )}
              </Accordion.Collapse>
            )}
            {showTypes.published && (
              <Accordion.Collapse title={"已发布"}>已发布</Accordion.Collapse>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

type RowItemProps = {
  tree: FileTreeState;
  handleDirectoryClick: (item: FileTreeItem) => void;
  handleFileClick: (item: FileTreeItem) => void;
  pid?: string;
};

const RowItems = memo(function RowItems(props: RowItemProps) {
  const { tree, handleDirectoryClick, handleFileClick, pid } = props;

  const rows = useMemo(() => {
    return Object.values(tree ?? {}).filter((item) => pid === item.pid);
  }, [pid, tree]);
  console.log(rows, "tree", pid);
  if (!rows.length) {
    return <></>;
  }

  return (
    <>
      {rows.map((item, index) => {
        const { kind, name, file } = item;
        if (file && kind === "file") {
          return (
            <div key={name + index} onClick={() => handleFileClick(item)}>
              {name}
            </div>
          );
        }
        return (
          <Accordion.Collapse
            key={name + index}
            noTransition
            defaultClose
            title={
              <div
                onClick={() => {
                  console.log(tree, "fileTree");
                  handleDirectoryClick(item);
                }}
              >
                {" > "}
                {name}
              </div>
            }
          >
            <RowItems
              pid={item.id}
              tree={tree}
              handleDirectoryClick={handleDirectoryClick}
              handleFileClick={handleFileClick}
            />
          </Accordion.Collapse>
        );
      })}
    </>
  );
});

type FileTreeItem = {
  file?: File;
  kind: string;
  name: string;
  id: string;
  pid?: string;
  handle: FileSystemDirectoryHandle | FileSystemFileHandle;
};

type FileTreeState = {
  [f: string]: FileTreeItem;
};

type FilePickerAction = {
  type: "expand" | " close" | "remove" | "move" | "create" | "append";
  preload?: object;
};

const fileTreeReducer: Reducer<FileTreeState, FilePickerAction> = (
  treeState,
  action
) => {
  let newState = treeState;
  switch (action.type) {
    case "append":
      newState = { ...treeState, ...action.preload };
      break;
    case "create":
      newState = { ...action.preload };
      break;
    default:
      break;
  }
  return newState;
};

export default memo(FilePicker);
