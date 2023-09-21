import { RichEditor } from "@components/RichEditor";
import "./index.less";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";

export { Page };
const TIME_FORMAT = "YYYY/MM/DD HH:mm:ss";
function Page() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { userInfo, login } = useAuth();
  const [time, setTime] = useState(dayjs().format(TIME_FORMAT));
  useEffect(() => {
    timer.current = setTimeout(() => {
      setTime(dayjs().format(TIME_FORMAT));
    }, 1000);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [time]);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log(position);
  //   });
  // }, []);
  return (
    <div className="write-page">
      <div className="author">
        author: {userInfo.name ?? <span onClick={() => login()}>未登录</span>}
        {`  |       ${time}`}
      </div>
      <RichEditor />
    </div>
  );
}
