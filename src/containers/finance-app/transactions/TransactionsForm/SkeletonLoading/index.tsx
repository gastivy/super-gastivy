import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="grid grid-cols-2 gap-4 animate-pulse">
      <Each
        of={range(16)}
        render={(item) => (
          <div key={item} className="bg-gray-300 h-10 rounded w-full" />
        )}
      />
    </div>
  );
};
