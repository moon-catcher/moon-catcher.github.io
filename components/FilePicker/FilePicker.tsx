import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./FilePicker.less";
import Accordion from "@components/Accordion/Accordion";
import { GithubFile } from "../../pages/write/index.page";
import { apiGetRepoPathFiles } from "@api/github";
import { useAuth } from "@providers/AuthProvider";

type Props = {
  open: boolean;
  setFileContent: (value: string) => void;
  setTitle: (value: string) => void;
  onFilePickerOpenChange?: () => void;
  files: GithubFile[];
};

const CollapseContext = createContext<Map<string, GithubFile[]> | undefined>(
  undefined
);
const FilePicker = (props: Props) => {
  const { files, setFileContent, setTitle } = props;
  const { userInfo, login, octokit } = useAuth();
  const fileTreeMap = useRef(new Map<string, GithubFile[]>());
  const [showTypes, setShowTypes] = useState({
    remoteDraft: true,
    localDraft: true,
    published: false,
  });

  const [currentFile, setCurrentFile] = useState<GithubFile | undefined>();

  useEffect(() => {
    if (currentFile && octokit) {
      setTitle(currentFile.path);
      if (currentFile) {
        if (fileTreeMap.current.has(currentFile.path)) {
          return;
        }
        apiGetRepoPathFiles(octokit, {
          owner: "moon-catcher",
          path: currentFile.path,
        }).then((res) => {
          console.log(res.data, "res");
          if (res.data instanceof Array) {
            fileTreeMap.current.set(currentFile.path, res.data as GithubFile[]);
          } else {
            const file = res.data as GithubFile;
            setFileContent(atob(file.content ?? ""));
          }
        });
      }
    }
  }, [currentFile, octokit]);

  useEffect(() => {
    if (files.length) {
      setCurrentFile(files[0]);
      fileTreeMap.current.set("", files);
    }
  }, [files]);

  const handleShowTypesChange = useCallback((key: string, checked: boolean) => {
    setShowTypes((old) => ({ ...old, [key]: checked }));
  }, []);

  const handleFileClick = useCallback((file: GithubFile) => {
    setCurrentFile(file);
    setFileContent(atob(file.content ?? ""));
  }, []);

  const handleDirClick = useCallback((file: GithubFile) => {
    setCurrentFile(file);
  }, []);

  return (
    <div
      className={[
        "FilePicker",
        props.open ? "filepicker-show" : "filepicker-hidden",
      ].join(" ")}
    >
      <div className="filepicker-box">
        <div className="filepicker-header">
          <div
            className="filepicker-tab"
            onClick={props.onFilePickerOpenChange}
          >
            Articles
          </div>
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
              <CollapseContext.Provider value={fileTreeMap.current}>
                {/* <Accordion.Collapse title={"在线草稿"}>
                  {props.files.map((file) => {
                    if (file.type === "file") {
                      return (
                        <div
                          key={file.path}
                          onClick={() => handleFileClick(file)}
                        >
                          {file.name}
                        </div>
                      );
                    }
                    return (
                      <Accordion key={file.path}>
                        <Accordion.Collapse
                          title={file.name}
                          onClick={() => handleDirClick(file)}
                        >
                          {fileTreeMap.current.get(file.path)?.map((file) => {
                            return (
                              <div
                                key={file.path}
                                onClick={() => handleFileClick(file)}
                              >
                                {file.name}
                              </div>
                            );
                          })}
                        </Accordion.Collapse>
                      </Accordion>
                    );
                  })}
                </Accordion.Collapse> */}
                <CollapseRenderer
                  path={""}
                  title={"在线草稿"}
                  handleDirClick={handleDirClick}
                  handleFileClick={handleFileClick}
                />
              </CollapseContext.Provider>
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

export default memo(FilePicker);
interface CollapseRendererProps {
  handleFileClick?: (file: GithubFile) => void;
  handleDirClick?: (file: GithubFile) => void;
  title: string;
  path: string;
}

export const CollapseRenderer = (props: CollapseRendererProps) => {
  const { handleFileClick, handleDirClick, title, path } = props;
  const fileTreeMap = useContext(CollapseContext);
  const files = fileTreeMap?.get(path) ?? [];
  return (
    <Accordion.Collapse title={title}>
      {files.map((file) => {
        if (file.type === "file") {
          return (
            <div key={file.path} onClick={() => handleFileClick?.(file)}>
              {file.name}
            </div>
          );
        }
        return (
          <Accordion key={file.path}>
            <CollapseRenderer
              path={file.path}
              title={file.name}
              handleDirClick={handleDirClick}
              handleFileClick={handleFileClick}
            />
          </Accordion>
        );
      })}
    </Accordion.Collapse>
  );
};
