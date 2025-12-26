import InputText from "@components/base/InputText";
import type React from "react";
import type { TimeHoursProps } from "./TimeHours.types";
import { cn } from "@libs/classnames";

const TimeHours: React.FC<TimeHoursProps> = ({ label, wrapperClassName }) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-shark-700">{label}</span>
      )}
      <div className={cn("w-full flex gap-2", wrapperClassName)}>
        <InputText
          shape="semi-rounded"
          wrapperClassName="min-w-[72px] max-w-[72px]"
          suffix={<div>h</div>}
        />
        <InputText
          shape="semi-rounded"
          wrapperClassName="min-w-[72px] max-w-[72px]"
          suffix={<div>m</div>}
        />
        <InputText
          shape="semi-rounded"
          wrapperClassName="min-w-[72px] max-w-[72px]"
          suffix={<div>s</div>}
        />
      </div>
    </div>
  );
};

export default TimeHours;
