import type React from "react";
import { timePickerVariants } from "./TimePicker.variants";
import type { TimerPickerProps } from "./TimePicker.types";
import { cn } from "@libs/classnames";
import Conditional from "../Conditional";
import useDisclosure from "@hooks/useDisclosure";
import { useMemo } from "react";
import Each from "../Each";
import useClickOutside from "@hooks/useClickOutside";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

const TimerPicker: React.FC<TimerPickerProps> = ({
  className,
  wrapperClassName,
  error,
  shape,
  size,
  value,
  label,
  onChange,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure({ open: false });
  const timePickerRef = useClickOutside(onClose);

  const [hour, minute] = useMemo(() => {
    if (!value) return ["", ""];
    return value.split(":");
  }, [value]);

  const setHour = (h: string) => {
    onChange?.(`${h}:${minute || "00"}`);
  };

  const setMinute = (m: string) => {
    onChange?.(`${hour || "00"}:${m}`);
  };

  return (
    <div
      ref={timePickerRef}
      className={cn("relative w-full flex flex-col gap-2", wrapperClassName)}
    >
      {label && (
        <span className="text-sm font-medium text-shark-700">{label}</span>
      )}

      {/* INPUT */}
      <div
        onClick={onOpen}
        className={cn(
          timePickerVariants({
            error: Boolean(error),
            shape,
            size,
            hasValue: true,
          }),
          "cursor-pointer select-none",
          className
        )}
      >
        <div className="w-1/2 text-center">{hour}</div>
        <div>:</div>
        <div className="w-1/2 text-center">{minute}</div>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {/* DROPDOWN */}
      <Conditional if={isOpen}>
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow">
          <div className="grid grid-cols-2 gap-1 p-1">
            {/* HOURS */}
            <div className="max-h-48 overflow-auto scrollbar-hidden">
              <Each
                of={HOURS}
                render={(h) => (
                  <div
                    ref={(el) => {
                      if (el && h === hour) {
                        el.scrollIntoView({ block: "center" });
                      }
                    }}
                    key={h}
                    className={cn(
                      "cursor-pointer px-3 py-2 text-sm text-center hover:bg-green-yellow-100 rounded",
                      h === hour &&
                        "bg-green-yellow-400 text-limed-spruce-800 font-medium"
                    )}
                    onClick={() => setHour(h)}
                  >
                    {h}
                  </div>
                )}
              />
            </div>

            {/* MINUTES */}
            <div className="max-h-48 overflow-auto scrollbar-hidden">
              <Each
                of={MINUTES}
                render={(m) => (
                  <div
                    ref={(el) => {
                      if (el && m === minute) {
                        el.scrollIntoView({ block: "center" });
                      }
                    }}
                    key={m}
                    className={cn(
                      "cursor-pointer px-3 py-2 text-sm text-center hover:bg-green-yellow-100 rounded",
                      m === minute &&
                        "bg-green-yellow-400 text-limed-spruce-800 font-medium"
                    )}
                    onClick={() => setMinute(m)}
                  >
                    {m}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </Conditional>
    </div>
  );
};

export default TimerPicker;
