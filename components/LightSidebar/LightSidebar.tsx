import React, {
  useEffect,
  useState,
  Children,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./LightSidebar.less";
import { MIN_SHOW_NAV } from "@constant/ui";
import WriteButton from "@components/Buttons/WriteButton/WriteButton";
import SearchButton from "@components/Buttons/SearchButton/SearchButton";
import SaveButton from "@components/Buttons/SaveButton/SaveButton";
import SubmitButton from "@components/Buttons/SubmitButton/SubmitButton";

export const LightSidebarContext = React.createContext(false);

const LightSidebar = forwardRef<
  { setSaveFc: (_fc: () => void) => void; saveFc?: () => void },
  { children: React.ReactNode }
>(function LightSidebar(
  { children }: { children: React.ReactNode },
  ref: React.Ref<{ setSaveFc: unknown }>
) {
  /**
   * type: 默认状态 0 宽屏 ; 1 窄屏
   */
  const [sidebarType, setSidebarType] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [saveFc, setSaveFc] = useState<() => void | null>();
  const chidrenCount = Children.count(children);

  useImperativeHandle(ref, () => {
    return {
      setSaveFc,
      saveFc,
    };
  });

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
  console.log(saveFc, "saveFc");

  return (
    <div className="lightSidebar">
      <div
        className="active-links"
        style={{ right: sidebarType === 0 || showMenu ? "calc(103%)" : 65 }}
      >
        <WriteButton />
        <SearchButton />
        <SaveButton onClick={() => saveFc?.()} />
        <SubmitButton onClick={() => saveFc?.()} />
      </div>
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
});
export { LightSidebar };
