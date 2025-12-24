import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="animate-pulse grid auto-rows-max grid-cols-3 max-[1100px]:grid-cols-2 max-[678px]:grid-cols-1 gap-4 p-6">
      <Each
        of={range(18)}
        render={(item) => (
          <div key={item} className="h-24 rounded-lg bg-gray-300" />
        )}
      />
    </div>
  );
};
