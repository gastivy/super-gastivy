import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="animate-pulse h-full flex flex-col justify-between gap-5">
      <div className="flex flex-col gap-5">
        <Each
          of={range(3)}
          render={(item) => (
            <div key={item} className="flex flex-col gap-1">
              <div className="h-5 w-40 bg-gray-300 rounded" />
              <div className="h-9 w-full max-w-lg bg-gray-300 rounded" />
            </div>
          )}
        />
      </div>

      <div className="flex gap-4">
        <div className="h-10 w-full max-w-lg bg-gray-300 rounded" />
        <div className="h-10 w-full max-w-lg bg-gray-300 rounded" />
      </div>
    </div>
  );
};
