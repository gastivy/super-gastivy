import type React from "react";
import { useMemo } from "react";

import { useNavigate } from "@tanstack/react-router";

import { Assets } from "@assets/illustrations";
import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import DatePickerRange from "@components/base/DatePickerRange";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import InfiniteScroll from "@components/base/InfiniteScroll";
import MultiSelect from "@components/base/MultiSelect";
import { routes } from "@constants/routes";
import { useDisplayWidth } from "@hooks/useDisplayWidth";
import { dateTime } from "@libs/dateTime";
import { useFilterActivity } from "@modules/activity/activity-log/hooks/useFilterActivity";
import { useGetCategory } from "@modules/activity/categories/hooks/useCategory";

import { CardActivityLog } from "./CardActivityLog";
import { SkeletonLoading } from "./SkeletonLoading";

const ActivityLogs: React.FC = () => {
  const navigate = useNavigate();
  const { widthScreen } = useDisplayWidth();
  const {
    logActivity,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    params,
    setParams,
    fetchNextPage,
  } = useFilterActivity();

  const { data } = useGetCategory({});

  const categoryOptions = useMemo(
    () =>
      (data?.data || []).map((category) => ({
        ...category,
        label: category.name,
        value: category.id,
      })),
    [data?.data]
  );

  const numberOfMonths = (() => {
    if (window.innerWidth >= 1048) return 2;
    if (window.innerWidth >= 960 && window.innerWidth < 1048) return 1;
    if (window.innerWidth >= 768 && window.innerWidth < 960) return 2;
    return 1;
  })();

  const handleAddActivity = () => {
    navigate({
      to: routes.activity.activityLog.path,
      state: (prev) => ({ ...prev, isCreated: true }),
    });
  };

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8">
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="text-shark-700 font-medium text-lg">Activity Logs</div>
        <Button shape="semi-round" onClick={handleAddActivity}>
          Add
        </Button>
      </div>

      <div className="max-h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-200px)] flex flex-col bg-white rounded-lg p-6 max-[960px]:p-4">
        <div className="flex max-[520px]:flex-col gap-5 pb-6 border-b border-gray-300">
          <DatePickerRange
            showShortcut={widthScreen > 520}
            numberOfMonths={numberOfMonths}
            mode="range"
            selected={{
              from: params.start_date ? new Date(params.start_date) : undefined,
              to: params.end_date ? new Date(params.end_date) : undefined,
            }}
            onSelect={(date) => {
              setParams((prev) => ({
                ...prev,
                start_date: date?.from
                  ? dateTime.formatDate(date?.from)
                  : undefined,
                end_date: date?.to ? dateTime.formatDate(date?.to) : undefined,
              }));
            }}
          />

          <MultiSelect
            value={params.category_id}
            placeholder="Select Category"
            size="regular"
            wrapperClassName="max-w-75 max-[520px]:max-w-130"
            options={categoryOptions}
            onSelect={(val) =>
              setParams((prev) => ({ ...prev, category_id: val }))
            }
          />
        </div>

        <InfiniteScroll
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onNextPage={fetchNextPage}
          className="h-[calc(100dvh)] pt-6"
        >
          <Conditional if={isLoading}>
            <SkeletonLoading />
          </Conditional>

          <Conditional if={!isLoading && logActivity.length === 0}>
            <div className="h-full flex flex-col justify-center items-center">
              <EmptyState
                src={Assets.ActivityEmpty}
                title="Activity Category is empty"
                className="max-w-90"
                description="You don't have any activity categories yet. Create one to start organizing your activities."
              />
            </div>
          </Conditional>

          <Conditional if={!isLoading && logActivity.length > 0}>
            <div className="flex flex-col gap-4">
              <Each
                of={logActivity}
                render={(activity) => (
                  <div
                    className="flex flex-col gap-2"
                    key={activity.key}
                    id={`activity-${activity.key}`}
                  >
                    <div className="sticky -top-4 px-4 py-1 rounded-full w-max mx-auto text-center transition-all duration-200 text-shark-900 text-sm font-medium bg-green-yellow-200 z-1">
                      {dateTime.getDate(new Date(activity.key), "en-GB", {
                        dateStyle: "long",
                      })}
                    </div>

                    <div className="flex flex-col">
                      <Each
                        of={activity.logActivity}
                        render={(log) => (
                          <CardActivityLog log={log} key={log.id} />
                        )}
                      />
                    </div>
                  </div>
                )}
              />
            </div>
          </Conditional>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ActivityLogs;
