import "./index.less";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useRef, useState } from "react";

export { Page };
const TIME_FORMAT = "YYYY/MM/DD HH:mm:ss";
function Page() {
  const timer = useRef<NodeJS.Timeout | null>(null);
  const { userInfo, login } = useAuth();

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     console.log(position);
  //   });
  // }, []);
  return (
    <div className="write-setting-page">
      <div
        style={{ cursor: "pointer" }}
        onClick={() => {
          history.back();
        }}
      >
        返回
      </div>
      设置
    </div>
  );
}
