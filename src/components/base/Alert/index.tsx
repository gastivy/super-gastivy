import { cn } from "@libs/classnames";
import type React from "react";
import { alertVariants } from "./Alert.variants";

interface AlertProps {
  message: string;
  variant?: "error" | "warning" | "success";
  className?: string;
}
const Alert: React.FC<AlertProps> = ({
  className,
  message,
  variant = "success",
}) => {
  return (
    <div className={cn(alertVariants({ variant, className }))}>
      <div className="flex flex-col gap-1">
        <div className="text-xs">{message}</div>
      </div>
    </div>
  );
};

export default Alert;
