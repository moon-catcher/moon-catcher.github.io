import React, { useEffect, useState, Children } from "react";
import "./LightSidebar.less";
import { MIN_SHOW_NAV } from "@constant/ui";

export const LightSidebarContext = React.createContext(false);

export function LightSidebar({ children }: { children: React.ReactNode }) {
  /**
   * type: 默认状态 0 宽屏 ; 1 窄屏
   */
  const [sidebarType, setSidebarType] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const chidrenCount = Children.count(children);

  useEffect(() => {
    if (location.search.includes("menu")) {
      setShowMenu(true);
      const menuCheckbox = document.querySelector("#toggle");
      if (menuCheckbox && menuCheckbox instanceof HTMLInputElement) {
        menuCheckbox.checked = true;
      }
    }

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
      setShowMenu(true);
      history.pushState(null, "menu", "?menu"); //第一二参数可忽略设置为null
    } else {
      setShowMenu(false);
      window.history.replaceState(null, "menu", location.pathname);
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
        <LightSidebarContext.Provider value={showMenu}>
          {children}
        </LightSidebarContext.Provider>
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
