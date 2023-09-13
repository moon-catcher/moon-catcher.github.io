import { useEffect, useState, Children } from "react";
import "./LightSidebar.less";
import { MIN_SHOW_NAV } from "@constant/ui";

export function LightSidebar({ children }: { children: React.ReactNode }) {
  /**
   * type: 默认状态 0 宽屏 ; 1 窄屏
   */
  const [sidebarType, setSidebarType] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  console.log(sidebarType, "sidebarType");
  const chidrenCount = Children.count(children);
  console.log(chidrenCount, "chidrenCount");

  useEffect(() => {
    if (window.innerWidth > MIN_SHOW_NAV) {
      setSidebarType(0);
    } else {
      setSidebarType(1);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleWindowResize = (event: any) => {
      if (event?.target?.innerWidth > MIN_SHOW_NAV) {
        setSidebarType(0);
      } else {
        setSidebarType(1);
      }
    };
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleMenuCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      console.log(event, "event");
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  };
  return (
    <div className="lightSidebar">
      <div
        className={[
          "right-sidebar",
          sidebarType !== 0 ? "hidden" : "",
          showMenu ? "force-show" : "",
        ].join(" ")}
        style={{
          height: sidebarType === 0 || showMenu ? chidrenCount * 35 : 0,
        }}
      >
        {children}
      </div>
      <div
        className={[
          "show-right-sidebar",
          sidebarType !== 0 ? "" : "button-hidden",
        ].join(" ")}
      >
        <input id="toggle" type="checkbox" onChange={handleMenuCheck}></input>
        <label
          htmlFor="toggle"
          className="hamburger"
          style={
            showMenu
              ? {
                  bottom: -45,
                }
              : { top: 0 }
          }
        >
          <div className="top-bun"></div>
          <div className="meat"></div>
          <div className="bottom-bun"></div>
        </label>
      </div>
    </div>
  );
}
