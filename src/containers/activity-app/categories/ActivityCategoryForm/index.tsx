import { Controller } from "react-hook-form";

import { IconArrowNarrowLeft } from "@tabler/icons-react";

import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import DatePicker from "@components/base/DatePicker";
import InputText from "@components/base/InputText";
import ModalConfirm from "@components/base/ModalConfirm";
import { useActivityCategoryForm } from "@modules/activity/categories/hooks/useActivityCategoryForm";

import { SkeletonLoading } from "./SkeletonLoading";

const ActivityCategoryForm = () => {
  const {
    confirmDeleteModal,
    title,
    name,
    target,
    errors,
    isLoading,
    control,
    register,
    handleSubmit,
    handleUpsert,
    handeDelete,
    handleBack,
  } = useActivityCategoryForm();

  return (
    <>
      <ModalConfirm
        isOpen={confirmDeleteModal.isOpen}
        title="Are you sure you want to delete this?"
        description="This activity category will be permanently deleted. This action cannot be undone."
        onClose={confirmDeleteModal.onClose}
        onConfirm={handeDelete}
      />

      <div className="flex flex-col gap-4 max-[960px]:gap-8 max-[960px]:pb-24">
        <div className="flex items-center gap-2 bg-white p-6 max-[960px]:p-4 sticky top-0 max-[960px]:top-4 z-1 rounded-lg max-[960px]:shadow-xl shadow-shark-800/10">
          <IconArrowNarrowLeft
            size={28}
            className="cursor-pointer"
            onClick={handleBack}
          />
          <div className="text-lg font-medium">{title}</div>
        </div>

        <div className="h-[calc(100dvh-130px)] max-[960px]:h-[calc(100dvh-190px)] overflow-y-auto max-[960px]:overflow-x-auto flex flex-col justify-between bg-white rounded-lg p-6 max-[960px]:p-4">
          <Conditional if={isLoading}>
            <SkeletonLoading />
          </Conditional>
          <Conditional if={!isLoading}>
            <div className="flex flex-col gap-5 max-w-lg">
              <InputText
                value={name}
                label="Category Name"
                size="regular"
                shape="semi-rounded"
                placeholder="Input Category Name"
                className="mt-1"
                maxLength={30}
                error={errors.name?.message}
                {...register("name")}
              />

              <InputText
                value={target}
                type="text"
                label="Target Daily"
                size="regular"
                shape="semi-rounded"
                placeholder="Input Target Daily"
                className="mt-1"
                maxLength={30}
                error={errors.target?.message}
                {...register("target")}
              />

              <Controller
                name="start_date"
                control={control}
                render={({ field }) => {
                  const currentDate = field.value
                    ? new Date(field.value)
                    : undefined;
                  return (
                    <DatePicker
                      label="Start Date"
                      value={currentDate}
                      error={errors.start_date?.message}
                      onSelect={(value) => field.onChange(value)}
                    />
                  );
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="large"
                shape="semi-round"
                className="w-full"
                onClick={confirmDeleteModal.onOpen}
              >
                Delete
              </Button>
              <Button
                size="large"
                shape="semi-round"
                className="w-full"
                onClick={handleSubmit(handleUpsert)}
              >
                Save
              </Button>
            </div>
          </Conditional>
        </div>
      </div>
    </>
  );
};

export default ActivityCategoryForm;
