import DatePicker from "@components/base/DatePicker";
import Icon from "@components/base/Icon";
import Select from "@components/base/Select";
import { routes } from "@constants/routes";
import { useGetCategory } from "@modules/activity/categories/hooks/useCategory";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import Switch from "@components/base/Switch";
import TimePicker from "@components/base/TimePicker";
import Each from "@components/base/Each";
import Button from "@components/base/Button";
import { cn } from "@libs/classnames";
import { useDisplayWidth } from "@hooks/useDisplayWidth";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Controller,
  useFieldArray,
  useForm,
  type SubmitHandler,
} from "react-hook-form";
import { schemaActivities } from "@modules/activity/activity-log/schemas/activity";
import {
  useCreateActivity,
  useUpdateActivity,
} from "@modules/activity/activity-log/hooks/useActivity";
import { useQueryClient } from "@tanstack/react-query";
import TimeHours from "@components/base/TimeHours";
import type { LogActivity } from "@modules/activity/activity-log/models";
import { dateTime } from "@libs/dateTime";
import { type useDisclosureProps } from "@hooks/useDisclosure";
import Disclosure from "@components/base/Disclosure";

interface FormActivity {
  seconds: number;
  categoryActivity: string | undefined;
  startDate: Date | undefined;
  startTime: string | undefined;
  isDone: NonNullable<boolean | undefined>;
}

interface FormValues {
  activities: FormActivity[];
}

const ActivityLogForm = () => {
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const navigate = useNavigate();
  const { widthScreen } = useDisplayWidth();
  const form = routerState.location.state.form as LogActivity;

  const defaultActivity: FormActivity = {
    categoryActivity: undefined,
    startDate: undefined,
    startTime: undefined,
    seconds: 0,
    isDone: false,
  };

  const {
    control,
    formState: { errors },
    handleSubmit: onSubmit,
    setValue,
  } = useForm({
    // @ts-ignore
    resolver: yupResolver(schemaActivities),
    defaultValues: {
      activities: [defaultActivity],
    },
  });

  const { data } = useGetCategory({});

  const { mutate: createActivity } = useCreateActivity({
    onSuccess: async () => {
      navigate({ to: routes.activity.activityLog.path });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const { mutate: updateActivity } = useUpdateActivity({
    onSuccess: () => {
      navigate({ to: routes.activity.activityLog.path });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "activities",
  });

  const categoryOptions = useMemo(
    () =>
      (data?.data || []).map((category) => ({
        ...category,
        label: category.name,
        value: category.id,
      })),
    [data?.data]
  );

  const handleCreate: SubmitHandler<FormValues> = (activityData) => {
    const activities = activityData.activities.map((act) => {
      const time = act.startTime?.split(":") || [];
      if ((time?.length || 0) === 2)
        (act.startDate as Date).setHours(
          Number(time[0]),
          Number(time[1]),
          0,
          0
        );

      const dateInSeconds = new Date(
        new Date(act.startDate || "")?.getTime() + act.seconds * 1000
      );
      return {
        category_id: act.categoryActivity as string,
        start_date: act.startDate as Date,
        end_date: dateInSeconds,
        seconds: act.seconds,
        is_done: act.isDone,
        description: "",
      };
    });

    // For Update Activity
    if (form?.id) {
      updateActivity({
        id: form?.id,
        ...(!!activities[0].category_id && {
          category_id: activities[0].category_id,
        }),
        is_done: activities[0].is_done,
        start_date: activities[0].start_date,
        end_date: activities[0].end_date,
        seconds: activities[0].seconds,
      });
      return;
    }

    // For Create Activity
    createActivity({
      activities: activities,
    });
  };

  useEffect(() => {
    if (form?.seconds) {
      setValue(`activities.${0}.seconds`, form.seconds);
    }

    if (form?.start_date) {
      const date = form?.start_date ? new Date(form?.start_date) : new Date();
      const hour = date.getHours();
      const minute = date.getMinutes();
      date.setHours(hour, minute, 0);

      setValue(`activities.${0}.categoryActivity`, form?.category_id || "");
      setValue(`activities.${0}.startDate`, form?.start_date || "");
      setValue(`activities.${0}.isDone`, form?.is_done);
      setValue(
        `activities.${0}.startTime`,
        dateTime.formatTimeFromUTC(String(date))
      );
    }
  }, [form]);

  return (
    <div className="flex flex-col gap-4 max-[960px]:gap-8 max-[960px]:pb-24">
      <div className="flex justify-between items-center bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
        <div className="flex items-center gap-2">
          <Icon
            name="Arrow-Left-outline"
            className="cursor-pointer min-w-6"
            onClick={() => navigate({ to: routes.activity.activityLog.path })}
          />
          <div className="text-shark-800 font-medium">
            {form?.id ? "Update Activity Log" : "Create Activity Log"}
          </div>
        </div>
        <Button shape="semi-round" onClick={onSubmit(handleCreate)}>
          {form?.id ? "Save" : "Create"}
        </Button>
      </div>

      <div className="overflow-y-auto flex flex-col gap-6 bg-white rounded-lg p-5 max-[960px]:p-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-medium text-limed-spruce-800">
            Activity Items
          </div>

          {!form?.id && (
            <Button
              shape="semi-round"
              size="small"
              onClick={() => append(defaultActivity)}
            >
              <Icon name="Plus-solid" size={14} />
              Add
            </Button>
          )}
        </div>

        <div className="border-b border-gray-200" />

        <div className="h-[calc(100dvh-250px)] max-[960px]:h-[calc(100dvh-310px)] overflow-x-auto w-full flex flex-col max-[960px]:gap-5">
          <Each
            of={fields}
            render={(item, index) => {
              return (
                <Disclosure
                  defaultOpen
                  className={cn(
                    "min-w-max max-[960px]:w-full flex max-[960px]:flex-col items-start max-[960px]:items-start gap-6 border-b max-[960px]:border-none border-gray-300 py-6 max-[960px]:py-0",
                    index === 0 && "pt-0",
                    fields.length === 1 && index === 0 && "py-0",
                    fields.length - 1 === index && "border-0"
                  )}
                  key={item.id}
                >
                  {({ isOpen, onToggle }: useDisclosureProps) => (
                    <>
                      <div
                        className="max-[960px]:w-full flex justify-between items-center max-[960px]:py-3 max-[960px]:border-b border-gray-300"
                        onClick={() => widthScreen < 960 && onToggle()}
                      >
                        <div className="w-26 flex item-center text text-gray-400 font-medium">
                          Activity #{index + 1}
                        </div>

                        <div className="hidden max-[960px]:flex">
                          <Icon name="Down-outline" className="text-gray-400" />
                        </div>
                      </div>

                      {(isOpen || widthScreen > 960) && (
                        <div className="w-full flex max-[960px]:flex-col gap-6">
                          <Controller
                            name={`activities.${index}.categoryActivity`}
                            control={control}
                            rules={{
                              required: "Activity Category is Required",
                            }}
                            render={({ field }) => (
                              <Select
                                label={
                                  widthScreen < 960
                                    ? "Activity Category"
                                    : undefined
                                }
                                value={field.value}
                                placeholder="Select Activity Category"
                                error={
                                  errors.activities?.[index]?.categoryActivity
                                    ?.message
                                }
                                wrapperClassName="max-w-lg min-[960px]:min-w-[240px] min-[960px]:max-w-[240px]"
                                options={categoryOptions}
                                onSelect={(val) => {
                                  field.onChange(val);
                                }}
                              />
                            )}
                          />
                          <Controller
                            name={`activities.${index}.startDate`}
                            control={control}
                            rules={{
                              required: "Activity Category is Required",
                            }}
                            render={({ field }) => (
                              <DatePicker
                                label={
                                  widthScreen < 960 ? "Start Date" : undefined
                                }
                                wrapperClassName="max-w-lg min-[960px]:min-w-[200px] min-[960px]:max-w-[200px]"
                                value={field.value}
                                error={
                                  errors.activities?.[index]?.startDate?.message
                                }
                                onSelect={(value) => field.onChange(value)}
                              />
                            )}
                          />
                          <Controller
                            name={`activities.${index}.startTime`}
                            control={control}
                            rules={{
                              required: "Activity Category is Required",
                            }}
                            render={({ field }) => (
                              <TimePicker
                                label={
                                  widthScreen < 960 ? "Start Time" : undefined
                                }
                                value={field.value}
                                error={
                                  errors.activities?.[index]?.startTime?.message
                                }
                                shape="semi-rounded"
                                wrapperClassName="min-w-25 max-w-25"
                                onChange={(val) => field.onChange(val)}
                              />
                            )}
                          />
                          <Controller
                            name={`activities.${index}.seconds`}
                            control={control}
                            rules={{
                              required: "Time Hours is Required",
                            }}
                            render={({ field }) => (
                              <TimeHours
                                value={field.value}
                                label={
                                  widthScreen < 960 ? "Duration" : undefined
                                }
                                error={
                                  errors.activities?.[index]?.seconds?.message
                                }
                                onChange={(val) => field.onChange(val)}
                              />
                            )}
                          />

                          <Controller
                            name={`activities.${index}.isDone`}
                            control={control}
                            rules={{
                              required: "Activity Category is Required",
                            }}
                            render={({ field }) => (
                              <div className="min-[960px]:h-8.5 flex items-center">
                                <Switch
                                  enabled={field.value}
                                  label={
                                    widthScreen < 960
                                      ? "Is it done?"
                                      : undefined
                                  }
                                  className="min-w-16 max-w-16"
                                  onChange={(enabled) =>
                                    field.onChange(enabled)
                                  }
                                />
                              </div>
                            )}
                          />
                          {fields.length > 1 && (
                            <div className="flex flex-1 justify-end">
                              <Button
                                shape="semi-round"
                                variant="text"
                                className="max-[960px]:w-full max-[960px]:rounded-lg"
                                onClick={() => remove(index)}
                              >
                                Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </Disclosure>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogForm;
