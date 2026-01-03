import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="h-100 flex flex-col gap-4 py-4">
      <Each
        of={range(10)}
        render={(item) => (
          <div className="animate-pulse flex" key={item}>
            <div className="h-20 w-full rounded-xl bg-gray-100" />
          </div>
        )}
      />
    </div>
  );
};
