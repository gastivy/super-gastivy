import { Assets } from "@assets/illustrations";
import Conditional from "@components/base/Conditional";
import DatePickerRange from "@components/base/DatePickerRange";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import { useSummaryActivity } from "@modules/activity/overview/useSummaryActivity";
import type React from "react";
import { SkeletonLoading } from "./SkeletonLoading";
import { cn } from "@libs/classnames";

export const ProgressActivty: React.FC = () => {
  const {
    isLoading,
    activities,
    range,
    handleRangeSelect,
    handleClickActivity,
  } = useSummaryActivity();

  const numberOfMonths = (() => {
    if (window.innerWidth >= 1048) return 2;
    if (window.innerWidth >= 960 && window.innerWidth < 1048) return 1;
    if (window.innerWidth >= 768 && window.innerWidth < 960) return 2;
    return 1;
  })();

  return (
    <div className="w-full lg:max-w-[60%] flex flex-col gap-4">
      <div className="flex flex-col gap-5 bg-white p-4 rounded-lg shadow-2xl shadow-shark-400/10">
        <div className="font-medium text-xl">Overview Activity</div>

        <div className="relative flex justify-between gap-4">
          <DatePickerRange
            showShortcut
            numberOfMonths={numberOfMonths}
            mode="range"
            selected={range}
            onSelect={handleRangeSelect}
          />
        </div>
      </div>
      <div className="max-h-[calc(100dvh-260px)] overflow-auto flex flex-col px-4 bg-white">
        <Conditional if={isLoading}>
          <SkeletonLoading />
        </Conditional>
        <Conditional if={!isLoading && activities.length === 0}>
          <EmptyState
            src={Assets.ActivityEmpty}
            className="h-[calc(100dvh-260px)] bg-white p-4 rounded-lg"
            title="You haven't created an activity yet"
            description="Start create your activities now to achieve better productivity"
          />
        </Conditional>

        <Conditional if={!isLoading && activities.length > 0}>
          <Each
            of={activities}
            render={(item, index) => {
              const progress = Math.min(
                Math.floor((item.minutes / item.target) * 100),
                100
              );
              const minutesRemaining = item.minutes - item.target;
              return (
                <div
                  className={cn(
                    "h-[calc(100dvh-260px)] flex flex-col gap-3 py-4 border-shark-400/20 cursor-pointer",
                    activities.length - 1 === index ? "" : "border-b"
                  )}
                  key={index}
                  onClick={() => handleClickActivity(item)}
                >
                  <div className="flex justify-between">
                    <div className="text-md font-medium text-shark-900">
                      {item.name}
                    </div>
                    <div className="flex items-end flex-col gap-1">
                      <div className="text-sm text-limed-spruce-400">
                        {item.minutes}/{item.target} minutes
                      </div>
                      <div
                        className={cn("text-sm", {
                          "text-limed-spruce-400": minutesRemaining === 0,
                          "text-shark-400": minutesRemaining > 0,
                          "text-red-400": minutesRemaining < 0,
                        })}
                      >
                        {minutesRemaining <= 0
                          ? minutesRemaining
                          : `+${minutesRemaining}`}{" "}
                        minutes
                      </div>
                    </div>
                  </div>
                  <div className="h-3 w-full rounded-full relative bg-gray-100">
                    <div
                      className="absolute top-0 bottom-0 left-0 rounded-full bg-green-yellow-400"
                      style={{
                        width: `${progress}%`,
                      }}
                    ></div>
                  </div>
                </div>
              );
            }}
          />
        </Conditional>
      </div>
    </div>
  );
};
