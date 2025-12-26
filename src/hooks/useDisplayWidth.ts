import { useLayoutEffect, useState } from "react";

type BodyInfo = {
  width: number;
  height: number;
  lockScroll: () => void;
  unlockScroll: () => void;
};

export const useDisplayWidth = (): BodyInfo => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const lockScroll = () => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = "hidden";
  };

  const unlockScroll = () => {
    if (typeof document === "undefined") return;
    document.body.style.removeProperty("overflow");
  };

  useLayoutEffect(() => {
    if (typeof document === "undefined") return;

    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return {
    width: size.width,
    height: size.height,
    lockScroll,
    unlockScroll,
  };
};
