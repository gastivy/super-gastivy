import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <Each
        of={range(5)}
        render={(item) => (
          <div key={item} className="h-20 w-full bg-gray-200 rounded-lg" />
        )}
      />
    </div>
  );
};
