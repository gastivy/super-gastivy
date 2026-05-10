import type React from "react";
import { useRef } from "react";

import Spinner from "@components/base/Spinner";
import { cn } from "@libs/classnames";

import type { InfiniteScrollProps } from "./InfiniteScroll.types";

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  isFetchingNextPage,
  hasNextPage,
  children,
  className,
  onNextPage,
}) => {
  const refScrollView = useRef<HTMLDivElement>(null);

  const onScrollItem = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;
    const isBottom = Math.round(scrollHeight - scrollTop) - 5 <= clientHeight;

    if (!isFetchingNextPage && isBottom && hasNextPage) {
      onNextPage();
    }
  };
  return (
    <div
      ref={refScrollView}
      className={cn("relative flex flex-col overflow-y-auto", className)}
      onScroll={onScrollItem}
    >
      {children}
      {isFetchingNextPage && (
        <div className="w-full flex justify-center items-center bg-white py-2">
          <Spinner className="fill-shark-700 text-green-yellow-400" />
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
