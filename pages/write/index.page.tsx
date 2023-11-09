import { useAuth } from "@providers/AuthProvider";
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import dayjs from "dayjs";
import FilePicker from "@components/FilePicker/FilePicker";
import "./index.less";
import { apiGetRepoPathFiles } from "@api/github";
const MDEditor = lazy(() => import("@uiw/react-md-editor"));

export interface GithubFile {
  download_url: string;
  git_url: string;
  html_url: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  type: string;
  url: string;
  content?: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export { Page };
const TIME_FORMAT = "YYYY/MM/DD HH:mm:ss";
function Page() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { userInfo, login, octokit } = useAuth();
  const [time, setTime] = useState(dayjs().format(TIME_FORMAT));
  const [filePickerOpen, setFilePickerOpen] = useState(false);
  const [fileContent, setFileContent] = useState<string | undefined>();
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<GithubFile[]>([]);
  

  useEffect(() => {
    timer.current = setTimeout(() => {
      setTime(dayjs().format(TIME_FORMAT));
    }, 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [time]);



  useEffect(() => {
    if (octokit && userInfo.login) {
      apiGetRepoPathFiles(octokit, { owner: "moon-catcher" }).then((res) => {
        const files = res.data as GithubFile[];
        const currentFile = files?.[0];
        setFiles(files);
      });
    }
  }, [octokit, userInfo]);

  useEffect(() => {
    const handleQuickKey = (event: KeyboardEvent) => {
      console.log(event, "event");

      if (!event.ctrlKey) {
        return;
      }
      if (event.key === "e") {
        event.preventDefault();
        setFilePickerOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleQuickKey);
    return () => {
      window.removeEventListener("keydown", handleQuickKey);
    };
  }, []);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log(position);
  //   });
  // }, []);

  const handleFilePickerOpenChange = useCallback(() => {
    setFilePickerOpen((open) => !open);
  }, []);

  const onInput = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event as unknown as { target: { value: string } };
    setTitle(value);
  }, []);
  return (
    <>
      <div className="header">
        <FilePicker
          files={files}
          open={filePickerOpen}
          setTitle={setTitle}
          setFileContent={setFileContent}
          onFilePickerOpenChange={handleFilePickerOpenChange}
        />
        <button onClick={handleFilePickerOpenChange}>展开</button>
        <div>{title}</div>
        <div className="author">
          author: {userInfo.name ?? <span onClick={login}>未登录</span>}
          {`  |       ${time}`}
        </div>
      </div>
      <Suspense
        fallback={
          <div
            className="editor-content"
            style={{
              width: filePickerOpen ? "calc(100% - 300px)" : "100%",
              right: filePickerOpen ? "-150px" : "0px",
            }}
          >
            Loading...
          </div>
        }
      >
        <MDEditor
          className="editor-content"
          style={{
            width: filePickerOpen ? "calc(100% - 300px)" : "100%",
            right: filePickerOpen ? "-150px" : "0px",
          }}
          value={fileContent}
          onChange={setFileContent}
        />
      </Suspense>
    </>
  );
}
