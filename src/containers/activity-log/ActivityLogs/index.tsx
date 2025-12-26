import DatePickerRange from "@components/base/DatePickerRange";
import Each from "@components/base/Each";
import MultiSelect from "@components/base/MultiSelect";
import { dateTime } from "@libs/dateTime";
import { useFilterActivity } from "@modules/activity/activity-log/hooks/useFilterActivity";
import { useGetCategory } from "@modules/activity/categories/hooks/useCategory";
import type React from "react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { CardActivityLog } from "./CardActivityLog";
import Button from "@components/base/Button";
import { useNavigate } from "@tanstack/react-router";
import { routes } from "@constants/routes";

const ActivityLogs: React.FC = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [selected, setSelected] = useState<string[]>([]);
  const {
    logActivity,
    // isLoading,
    // isRefetching,
    // currentYear,
    // currentRange,
    // monthList,
    // idCategories,
    // setIdCategories,
    // setCurrentYear,
    // setCurrentRange,
  } = useFilterActivity();
  // const containerRef = useRef<HTMLDivElement>(null);
  // const itemIds = logActivity.map((a) => `activity-${a.key}`);
  // const stickyKey = useStickyVisible({ containerRef, itemIds });

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

      <div className="max-h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-200px)] overflow-y-auto flex flex-col bg-white rounded-lg p-6 max-[960px]:p-4">
        <div className="flex gap-5 pb-6 border-b border-gray-300">
          <DatePickerRange
            showShortcut
            numberOfMonths={numberOfMonths}
            mode="range"
            selected={range}
            onSelect={setRange}
          />

          <div className="w-full max-w-75">
            <MultiSelect
              value={selected}
              placeholder="Select Category"
              size="regular"
              options={categoryOptions}
              onSelect={setSelected}
            />
          </div>
        </div>

        <div className="relative flex flex-1 overflow-y-auto flex-col gap-4 pt-6">
          <Each
            of={logActivity.slice(0, 10)}
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
                    render={(log) => <CardActivityLog log={log} key={log.id} />}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
