import { Assets } from "@assets/illustrations";
import Button from "@components/base/Button";
import Conditional from "@components/base/Conditional";
import Each from "@components/base/Each";
import EmptyState from "@components/base/EmptyState";
import Icon from "@components/base/Icon";
import { routes } from "@constants/routes";
import { cn } from "@libs/classnames";
import { useGetCategory } from "@modules/activity/categories/hooks/useCategory";
import { useNavigate } from "@tanstack/react-router";
import { SkeletonLoading } from "./SkeletonLoading";

const ActivityCategoryList = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetCategory();

  const handleAddCategory = () => {
    navigate({
      to: routes.activity.categories.path,
      state: (prev) => ({
        ...prev,
        isCreated: true,
      }),
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center bg-white p-5 rounded-lg border border-shark-700/10">
        <div className="text-lg text-limed-spruce-700 font-medium">
          Activity Category
        </div>
        <Button shape="semi-round" onClick={handleAddCategory}>
          Tambah
        </Button>
      </div>

      <div
        className={cn(
          "h-[calc(100dvh-140px)] max-[960px]:h-[calc(100dvh-230px)] overflow-y-auto",
          ((data?.data || []).length === 0 || isLoading) && "bg-white"
        )}
      >
        <Conditional if={isLoading}>
          <SkeletonLoading />
        </Conditional>
        <Conditional if={!isLoading && (data?.data || []).length === 0}>
          <div className="h-full flex flex-col justify-center items-center">
            <EmptyState
              src={Assets.ActivityEmpty}
              title="Activity Category is empty"
              className="max-w-90"
              description="You don't have any activity categories yet. Create one to start organizing your activities."
            />
          </div>
        </Conditional>

        <Conditional if={(data?.data || []).length > 0}>
          <div className="grid auto-rows-max grid-cols-3 max-[1100px]:grid-cols-2 max-[678px]:grid-cols-1 gap-4">
            <Each
              of={data?.data || []}
              render={(category) => {
                return (
                  <div
                    key={category.id}
                    className="flex items-center gap-4 bg-white p-4 rounded-lg border border-shark-700/10 cursor-pointer"
                    onClick={() =>
                      navigate({
                        to: routes.activity.categories.path,
                        state: (prev) => ({ ...prev, categoryId: category.id }),
                      })
                    }
                  >
                    <div className="flex bg-green-yellow-400 p-2.5 rounded-lg">
                      <Icon
                        name="Activity-outline"
                        className="text-limed-spruce-900"
                        size={28}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-shark-700 font-medium">
                        {category.name}
                      </div>
                      <div className="text-sm text-shark-700">
                        {category.minutes} minutes
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </Conditional>
      </div>
    </div>
  );
};

export default ActivityCategoryList;
