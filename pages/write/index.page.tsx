import { useAuth } from "@providers/AuthProvider";
import { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import FilePicker from "@components/FilePicker/FilePicker";
import "./index.less";

export { Page };
const TIME_FORMAT = "YYYY/MM/DD HH:mm:ss";
function Page() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { userInfo, login } = useAuth();
  const [time, setTime] = useState(dayjs().format(TIME_FORMAT));
  const [filePickerOpen, setFilePickerOpen] = useState(true);
  const [fileContent, setFileContent] = useState("testteststestetest");
  const [title, setTitle] = useState("");

  useEffect(() => {
    timer.current = setTimeout(() => {
      setTime(dayjs().format(TIME_FORMAT));
    }, 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [time]);

  useEffect(() => {
    const filePickerOpen = localStorage.getItem("filePickerOpen");
    setFilePickerOpen(filePickerOpen !== "close");
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
    setFilePickerOpen((open) => {
      localStorage.setItem("filePickerOpen", !open ? "open" : "close");
      return !open;
    });
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
          open={filePickerOpen}
          handleFileContentChange={setFileContent}
          onFilePickerOpenChange={handleFilePickerOpenChange}
        />
        <button onClick={handleFilePickerOpenChange}>展开</button>
        <div className="header-title">
          <div className="author">
            author: {userInfo.name ?? <span onClick={login}>未登录</span>}
            {`  |       ${time}`}
          </div>
          <input
            className="title"
            onInput={onInput}
            suppressContentEditableWarning
            value={title ?? ""}
          />
        </div>
      </div>

      <div
        contentEditable
        className="editor-content"
        style={{
          width: filePickerOpen ? "calc(100% - 300px)" : "100%",
          right: filePickerOpen ? "-150px" : "0px",
        }}
      >
        {fileContent}
      </div>
    </>
  );
}
