import Each from "@components/base/Each";
import { range } from "@libs/common";

export const SkeletonLoading = () => {
  return (
    <div className="animate-pulse flex flex-col">
      <Each
        of={range(12)}
        render={(item) => {
          return (
            <div key={item} className="flex items-center gap-4 py-4">
              <div className="w-[40%] h-6 bg-gray-300 rounded-md" />
              <div className="w-[20%] h-6 bg-gray-300 rounded-md" />
              <div className="w-[20%] h-6 bg-gray-300 rounded-md" />
              <div className="w-[15%] h-6 bg-gray-300 rounded-md" />
              <div className="w-[5%] h-6 bg-gray-300 rounded-md" />
            </div>
          );
        }}
      />
    </div>
  );
};
