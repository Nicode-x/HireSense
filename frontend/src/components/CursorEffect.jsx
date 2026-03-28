import React, { useEffect, useRef, useState } from "react";

const CursorEffect = () => {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let ring = { x: 0, y: 0 };
    let mouse = { x: 0, y: 0 };
    let animFrameId;

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top  = `${e.clientY}px`;
      }
    };

    const onMouseEnterInteractive = () => setHovering(true);
    const onMouseLeaveInteractive = () => setHovering(false);

    const animate = () => {
      ring.x += (mouse.x - ring.x) * 0.12;
      ring.y += (mouse.y - ring.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = `${ring.x}px`;
        ringRef.current.style.top  = `${ring.y}px`;
      }
      animFrameId = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", onMouseMove);

    const attachListeners = (root = document) => {
      const els = root.querySelectorAll("a, button, input, textarea, select, [data-cursor]");
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterInteractive);
        el.removeEventListener("mouseleave", onMouseLeaveInteractive);
        el.addEventListener("mouseenter", onMouseEnterInteractive);
        el.addEventListener("mouseleave", onMouseLeaveInteractive);
      });
    };

    attachListeners();

    // Re-run on DOM changes
    const observer = new MutationObserver(() => attachListeners());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef}  className={`cursor-dot  ${hovering ? "hovering" : ""}`} />
      <div ref={ringRef} className={`cursor-ring ${hovering ? "hovering" : ""}`} />
    </>
  );
};

export default CursorEffect;
