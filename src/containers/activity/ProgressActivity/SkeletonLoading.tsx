import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="h-full overflow-y-auto bg-white flex flex-col gap-4 p-4 rounded-lg">
      <Each
        of={range(8)}
        render={(item) => (
          <div className="animate-pulse flex" key={item}>
            <div className="h-30 w-full rounded-xl bg-gray-100" />
          </div>
        )}
      />
    </div>
  );
};
