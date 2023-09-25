import { RichEditor } from "@components/RichEditor";
import "./index.less";
import { useAuth } from "@providers/AuthProvider";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import FilePicker from "@components/FilePicker/FilePicker";

export { Page };
const TIME_FORMAT = "YYYY/MM/DD HH:mm:ss";
function Page() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { userInfo, login } = useAuth();
  const [time, setTime] = useState(dayjs().format(TIME_FORMAT));
  const [filePickerOpen, setFilePickerOpen] = useState(true);
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
  return (
    <div className="write-page">
      <div className="author">
        author: {userInfo.name ?? <span onClick={() => login()}>未登录</span>}
        {`  |       ${time}`}
      </div>
      <FilePicker open={filePickerOpen} defaultDirectory="E:\myCode\OMS\docs\code"/>
      <RichEditor
        filePickerOpen={filePickerOpen}
        onFilePickerOpenChange={handleFilePickerOpenChange}
      />
    </div>
  );
}
