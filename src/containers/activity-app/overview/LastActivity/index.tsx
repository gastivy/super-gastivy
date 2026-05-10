import { IconClockHour9, IconFlameFilled } from "@tabler/icons-react";
import { useNavigate } from "@tanstack/react-router";

import { Assets } from "@assets/illustrations";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import { routes } from "@constants/routes";
import { dateTime } from "@libs/dateTime";
import { useGetActivity } from "@modules/activity/activity-log/hooks/useActivity";

import { SkeletonLoading } from "./SkeletonLoading";

export const LastActivity = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetActivity();
  const activities = data?.data || [];
  return (
    <div className="w-full lg:max-w-[40%] max-h-[calc(100dvh-120px)] max-[960px]:h-[calc(100dvh-200px)] flex flex-col gap-2 bg-white rounded-xl p-4 shadow-2xl shadow-shark-400/10">
      <div className="flex justify-between items-center pt-3 pb-5 border-b border-gray-300">
        <div className="font-medium text-xl">Last Activities</div>
        {activities.length > 0 && (
          <div
            className="text-limed-spruce-400 cursor-pointer"
            onClick={() => navigate({ to: routes.activity.activityLog.path })}
          >
            See All
          </div>
        )}
      </div>
      <div className="h-[calc(100dvh-230px)] overflow-y-auto flex flex-col">
        <Conditional if={isLoading}>
          <SkeletonLoading />
        </Conditional>
        <Conditional if={!isLoading && activities.length === 0}>
          <EmptyState
            src={Assets.ActivityEmpty}
            title="You have no activity"
            description="Start your activities now to achieve better productivity"
            className="py-10"
          />
        </Conditional>
        <Conditional if={!isLoading && activities?.length > 0}>
          <Each
            of={activities?.slice(0, 5)}
            render={({ is_done, seconds, ...activity }) => (
              <div
                className="flex flex-col gap-1 py-4 border-b border-shark-400/20"
                key={activity.id}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{activity.category_name}</div>
                  <div className="text-sm">
                    {dateTime.getRangeTime(
                      String(activity.start_date),
                      String(activity.end_date)
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {is_done ? (
                      <IconFlameFilled
                        size={18}
                        className="text-green-yellow-500"
                      />
                    ) : (
                      <IconClockHour9
                        stroke={2}
                        size={18}
                        className="text-limed-spruce-400"
                      />
                    )}
                    <div
                      className={
                        is_done ? "text-shark-900" : "text-limed-spruce-400"
                      }
                    >
                      {is_done ? "Done" : "Pause"}
                    </div>
                  </div>
                  <div className="text-sm text-limed-spruce-400">
                    {dateTime.convertSecondsToTimeFormat(seconds)}
                  </div>
                </div>
              </div>
            )}
          />
        </Conditional>
      </div>
    </div>
  );
};
