import React, { useEffect, useRef, useState } from "react";

import { cn } from "@libs/classnames";

import type { SwitchProps } from "./Switch.types";

const Switch: React.FC<SwitchProps> = ({
  enabled = false,
  className,
  label,
  onChange,
}) => {
  const [knobTranslate, setKnobTranslate] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const toggleSwitch = () => {
    const newState = !enabled;
    if (onChange) onChange(newState);
  };

  useEffect(() => {
    if (trackRef.current) {
      const trackWidth = trackRef.current.offsetWidth;
      const knobWidth = 24;
      const maxTranslate = trackWidth - knobWidth - 2 * 1;
      setKnobTranslate(enabled ? maxTranslate : 2);
    }
  }, [enabled]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}
      <div
        ref={trackRef}
        onClick={toggleSwitch}
        className={cn(
          "w-full h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300",
          enabled ? "bg-brand-400" : "bg-gray-300",
          className
        )}
      >
        <div
          className="bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300"
          style={{ transform: `translateX(${knobTranslate}px)` }}
        ></div>
      </div>
    </div>
  );
};

export default Switch;
