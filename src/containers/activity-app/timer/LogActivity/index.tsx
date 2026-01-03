import { Assets } from "@assets/illustrations";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import { cn } from "@libs/classnames";
import { dateTime } from "@libs/dateTime";
import type { DataActivity } from "@modules/activity/activity-log/models/dexie";
import type React from "react";

interface LogActivityProps {
  data: DataActivity[];
}

export const LogActivity: React.FC<LogActivityProps> = ({ data }) => {
  const activityData = [...data].reverse();
  return (
    <div className="w-[40%] max-[720px]:h-[calc(100dvh-190px)]  max-[720px]:w-full bg-white rounded-xl flex flex-col gap-10 max-[720px]:gap-6 px-4 py-8 max-[720px]:py-4 border border-shark-700/10">
      <div className="text-center text-xl font-medium text-limed-spruce-700">
        Current Log Activity
      </div>
      <Conditional if={activityData.length === 0}>
        <EmptyState
          src={Assets.ActivityEmpty}
          title="You haven't started any activities yet"
          description="Start your activity now"
        />
      </Conditional>
      <div className="flex flex-col overflow-y-auto">
        <Each
          of={activityData}
          render={({ start_date, end_date }, index) => (
            <div
              className={cn(
                "flex justify-between items-center border-limed-spruce-200 py-2",
                activityData.length - 1 === index ? "" : "border-b"
              )}
              key={index}
            >
              <div className="flex flex-col gap-1">
                <div className="text-sm">Start Time</div>
                <div className="text-limed-spruce-400 text-sm">
                  {dateTime.formatTimeFromUTC(String(start_date))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-sm">End Time</div>
                <div
                  className={cn(
                    "text-xs text-limed-spruce-400",
                    end_date ? "" : ""
                  )}
                >
                  {end_date
                    ? dateTime.formatTimeFromUTC(String(end_date))
                    : "On Going"}
                </div>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
