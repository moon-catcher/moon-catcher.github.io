import { useEffect, useRef } from "react";
import "./Background.css";

export function Background({
  htmlStr,
  className,
}: {
  htmlStr?: string;
  className?: string;
}) {
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (backgroundRef.current) {
      if (htmlStr) {
        backgroundRef.current.innerHTML = htmlStr;
      }
    }
  }, [htmlStr]);
  return (
    <div ref={backgroundRef} className={["background", className].join(" ")}>
      <a href="/edit">
        <div className="moon"></div>
      </a>
      <div className="container">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star2"></div>
        <div className="shooting-star3"></div>
        <div className="mountains"></div>
        <div className="land">
          <div className="windmill">
            <div className="light"></div>
            <div className="blades"></div>
          </div>
          <div className="tree"></div>
        </div>
      </div>
    </div>
  );
}
