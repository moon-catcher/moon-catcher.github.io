import { useRef } from "react";
import "./HorizontalBox.less";
export function HorizontalBox({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    console.log(event, "event");

    let speed: number;
    if (event.deltaY > 0) {
      speed = 8000;
    } else {
      speed = 10000;
    }
    if (timer.current) clearTimeout(timer.current);
    event.stopPropagation();
    for (let i = 1; i < 40; i++) {
      timer.current = setTimeout(() => {
        if (box.current) box.current.scrollLeft += (event.deltaY * 200) / speed;
      }, i * 10);
    }
  };
  return (
    <div ref={box} className="horizontalBox" onWheel={handleWheel}>
      <div className="scrollbox">{children}</div>
    </div>
  );
}
