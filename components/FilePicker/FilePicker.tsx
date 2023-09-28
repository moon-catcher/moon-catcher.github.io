import {
  Reducer,
  memo,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import "./FilePicker.less";
import Accordion from "@components/Accordion/Accordion";

type Props = {
  open: boolean;
  defaultDirectory?: string;
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
  const [tree, settree] = useState<object | undefined>();
  const [fileTree, dispatch] = useReducer(fileTreeReducer, {});
  const showCode = async (item: any, index: number) => {
    const file = await item.fileHandle.getFile();
    const text = await file.text();
    console.log(text);
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

        // const newOut = (out[entry.name] = {});
        out[entry.name] = {};
        // if(){}
        // await handleDirectoryEntry(entry, newOut);
      }
    }
    return out;
  }

  const initDraftDirHandle = useCallback(async () => {
    setLocalLoading(() => true);
    const root = await navigator.storage.getDirectory();
    console.log(root, "root");
    const draftDirHandle = await root.getDirectoryHandle("draft", {
      create: true,
    });
    setDraftDirHandle(draftDirHandle);
    const out = await handleDirectoryEntry(draftDirHandle, {});
    settree(out);
    setLocalLoading(() => false);
  }, []);

  const handleShowTypesChange = useCallback((key: string, checked: boolean) => {
    setShowTypes((old) => ({ ...old, [key]: checked }));
  }, []);

  useEffect(() => {
    initDraftDirHandle();
  }, [initDraftDirHandle]);

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
        <div className="filepicker-draft-box">
          <Accordion>
            <Accordion.Collapse>
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
              <div>9999</div>
              <div>9999</div>
              <div>9999</div>
              <div>9999</div>
              <div>9999</div>
            </Accordion.Collapse>
            <Accordion.Collapse>3</Accordion.Collapse>
          </Accordion>
        </div>
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
