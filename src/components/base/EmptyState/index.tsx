import { cn } from "@libs/classnames";

import type { EmptyStateProps } from "./EmptyState.types";

const EmptyState: React.FC<EmptyStateProps> = ({
  src,
  width = 200,
  height = 200,
  title = "Hello world!",
  description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum, enim.",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-10 p-4",
        className
      )}
    >
      <img src={src} width={width} height={height} />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-xl font-medium text-slate-800">{title}</div>
        <div className="text-slate-800">{description}</div>
      </div>
    </div>
  );
};

export default EmptyState;
