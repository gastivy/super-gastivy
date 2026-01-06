import { cn } from "@libs/classnames";
import type React from "react";

interface RowDataProps {
  label: string;
  value: string;
  className?: string;
}

export const RowData: React.FC<RowDataProps> = ({
  label,
  value,
  className,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className={cn("text-sm")}>{label}</div>
      <div className={cn("text-sm text-gray-500", className)}>{value}</div>
    </div>
  );
};
