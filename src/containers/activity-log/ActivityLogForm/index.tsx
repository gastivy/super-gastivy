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
import Button from "@components/base/Button";
import TimeHours from "@components/base/TimeHours";
import { cn } from "@libs/classnames";
import { useDisplayWidth } from "@hooks/useDisplayWidth";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { schemaActivities } from "@modules/activity/activity-log/schemas/activity";

const ActivityLogForm = () => {
  const navigate = useNavigate();
  const { width } = useDisplayWidth();
  const defaultActivity = {
    categoryActivity: "",
    startDate: new Date(),
    startTime: "",
    seconds: 0,
    minutes: 0,
    hours: 0,
    isDone: false,
  };
  const {
    control,
    formState: { errors },
    handleSubmit: onSubmit,
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schemaActivities),
    defaultValues: {
      activities: [defaultActivity],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

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

      <div className="min-[960px]:h-[calc(100dvh-130px)] overflow-y-auto max-[960px]:overflow-x-auto flex flex-col gap-2 bg-white rounded-lg p-5 max-[960px]:p-4">
        <div className="flex flex-col">
          <Each
            of={fields}
            render={(item, index) => {
              return (
                <div
                  className={cn(
                    "min-[1340px]:w-full max-[1340px]:w-240 max-[960px]:w-full flex max-[960px]:flex-col items-center max-[960px]:items-start gap-6 border-b border-gray-300 py-6",
                    index === 0 && "pt-0",
                    fields.length === 1 && index === 0 && "py-0",
                    fields.length - 1 === index && "border-0"
                  )}
                  key={item.id}
                >
                  <Controller
                    name={`activities.${index}.categoryActivity`}
                    control={control}
                    rules={{
                      required: "Activity Category is Required",
                    }}
                    render={({ field }) => (
                      <Select
                        label={width < 960 ? "Activity Category" : undefined}
                        value={field.value}
                        placeholder="Select Activity Category"
                        wrapperClassName="max-w-lg min-[960px]:min-w-[240px] min-[960px]:max-w-[240px]"
                        options={categoryOptions}
                        onSelect={(val) => {
                          field.onChange(val);
                        }}
                      />
                    )}
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
                  <Controller
                    name={`activities.${index}.isDone`}
                    control={control}
                    rules={{
                      required: "Activity Category is Required",
                    }}
                    render={({ field }) => (
                      <Switch
                        enabled={field.value}
                        label={width < 960 ? "Is it done?" : undefined}
                        className="min-w-16 max-w-16"
                      />
                    )}
                  />
                  <div className="w-full flex justify-end">
                    <div
                      className="w-max flex items-center gap-1 px-4 py-2 bg-red-400 text-white rounded cursor-pointer"
                      onClick={() => {
                        console.log("INDEX: ", index);
                        remove(index);
                      }}
                    >
                      <Icon name="Trash-outline" size={16} />
                      <div className="text-white text-xs">Delete</div>
                    </div>
                  </div>
                  {/* <div className="">
                    <Icon name="Trash-outline" />
                    <div>Delete</div>
                  </div> */}
                </div>
              );
            }}
          />
        </div>
        <div
          className="flex justify-center items-center gap-2 p-4 border border-dashed border-gray-300 rounded-lg text-gray-500 cursor-pointer hover:bg-green-yellow-50"
          onClick={() => append(defaultActivity)}
        >
          <Icon name="Plus-solid" size={20} />
          Add New Activity
        </div>
      </div>
    </div>
  );
};

export default ActivityLogForm;
