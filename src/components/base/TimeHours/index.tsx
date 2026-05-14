import { useMemo } from "react";

import InputText from "@components/base/InputText";
import { cn } from "@libs/classnames";
import { dateTime } from "@libs/dateTime";

import type { TimeHoursProps } from "./TimeHours.types";

const TimeHours: React.FC<TimeHoursProps> = ({
  value = 0,
  label,
  error,
  wrapperClassName,
  onChange,
}) => {
  const { hours, minutes, seconds } = useMemo(
    () => dateTime.secondsToHMS(value),
    [value]
  );

  const handleChange = (val: string, type: "hours" | "minutes" | "seconds") => {
    const num = Number(val) || 0;

    const h = type === "hours" ? num : hours;
    const m = type === "minutes" ? num : minutes;
    const s = type === "seconds" ? num : seconds;

    onChange(dateTime.HMSToSeconds(h, m, s));
  };

  return (
    <div className={cn("flex flex-col gap-2 max-w-58", wrapperClassName)}>
      {label && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}

      <div className="w-full flex gap-2">
        <InputText
          value={hours}
          type="number"
          min={0}
          shape="semi-rounded"
          error={Boolean(error)}
          wrapperClassName="min-w-[72px] max-w-[72px]"
          suffix={<div>h</div>}
          onChangeInput={(val) => handleChange(val, "hours")}
        />

        <InputText
          value={minutes}
          type="number"
          min={0}
          max={59}
          shape="semi-rounded"
          error={Boolean(error)}
          wrapperClassName="min-w-[72px] max-w-[72px]"
          suffix={<div>m</div>}
          onChangeInput={(val) => handleChange(val, "minutes")}
        />

        <InputText
          value={seconds}
          type="number"
          min={0}
          max={59}
          shape="semi-rounded"
          error={Boolean(error)}
          wrapperClassName="min-w-[72px] max-w-[72px]"
          suffix={<div>s</div>}
          onChangeInput={(val) => handleChange(val, "seconds")}
        />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default TimeHours;
