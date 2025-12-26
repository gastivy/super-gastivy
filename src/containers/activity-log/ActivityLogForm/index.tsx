import DatePicker from "@components/base/DatePicker";
import Icon from "@components/base/Icon";
import Select from "@components/base/Select";
import { routes } from "@constants/routes";
import { useGetCategory } from "@modules/activity/categories/hooks/useCategory";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import Switch from "@components/base/Switch";
import TimePicker from "@components/base/TimePicker";
import Each from "@components/base/Each";
import { range } from "@libs/common";
import Button from "@components/base/Button";
import TimeHours from "@components/base/TimeHours";
import { cn } from "@libs/classnames";
import { useDisplayWidth } from "@hooks/useDisplayWidth";

const ActivityLogForm = () => {
  const navigate = useNavigate();
  const { width } = useDisplayWidth();

  const { data } = useGetCategory({});
  const [times, setTimes] = useState("");

  const [activityId, setActivityId] = useState("");

  const categoryOptions = useMemo(
    () =>
      (data?.data || []).map((category) => ({
        ...category,
        label: category.name,
        value: category.id,
      })),
    [data?.data]
  );
  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8 max-[960px]:pb-24">
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="flex items-center gap-2">
          <Icon
            name="Arrow-Left-outline"
            className="cursor-pointer min-w-6"
            onClick={() => navigate({ to: routes.activity.activityLog.path })}
          />
          <div className="text-shark-800 font-medium">Create Activity Log</div>
        </div>
        <Button shape="semi-round">Create</Button>
      </div>

      <div className="min-[960px]:h-[calc(100dvh-130px)] overflow-y-auto max-[960px]:overflow-x-auto flex flex-col bg-white rounded-lg p-6 max-[960px]:p-4">
        <Each
          of={range(10)}
          render={(item, index) => {
            return (
              <div
                className={cn(
                  "min-[1340px]:w-full max-[1340px]:w-240 max-[960px]:w-full flex max-[960px]:flex-col items-center max-[960px]:items-start gap-6 border-b border-gray-300 py-6",
                  index === 0 && "pt-0",
                  range(5).length === 1 && index === 0 && "py-0",
                  range(5).length - 1 === index && "border-0"
                )}
                key={item}
              >
                <Select
                  label={width < 960 ? "Activity Category" : undefined}
                  value={activityId}
                  placeholder="Select Activity Category"
                  wrapperClassName="max-w-lg min-[960px]:min-w-[240px] min-[960px]:max-w-[240px]"
                  options={categoryOptions}
                  onSelect={(val) => {
                    setActivityId(val);
                  }}
                />
                <DatePicker
                  label={width < 960 ? "Start Date" : undefined}
                  wrapperClassName="max-w-lg min-[960px]:min-w-[200px] min-[960px]:max-w-[200px]"
                  value={new Date()}
                  // error={errors.start_date?.message}
                  // onSelect={(value) => field.onChange(value)}
                />
                <TimePicker
                  label={width < 960 ? "Start Time" : undefined}
                  value={times}
                  shape="semi-rounded"
                  wrapperClassName="min-w-25 max-w-25"
                  onChange={setTimes}
                />
                <TimeHours
                  label={width < 960 ? "Time" : undefined}
                  wrapperClassName="min-w-[240px] max-w-[240px]"
                />
                <Switch
                  label={width < 960 ? "Is it done?" : undefined}
                  className="min-w-16 max-w-16"
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default ActivityLogForm;
