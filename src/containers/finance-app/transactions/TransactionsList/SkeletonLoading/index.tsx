import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse overflow-y-auto">
      <Each
        of={range(6)}
        render={(item) => (
          <div key={item} className="min-h-20 w-full bg-gray-300 rounded" />
        )}
      />
    </div>
  );
};
