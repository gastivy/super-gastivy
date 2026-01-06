import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <Each
        of={range(12)}
        render={(item) => (
          <div className="flex justify-between gap-4">
            <div className="h-6 w-42 rounded bg-gray-300" key={item} />
            <div className="h-6 w-42 rounded bg-gray-300" key={item} />
          </div>
        )}
      />
    </div>
  );
};
