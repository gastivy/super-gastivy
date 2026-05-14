import type React from "react";

import { cn } from "@libs/classnames";

import type { TextAreaProps } from "./TextArea.types";
import { textareaVariants } from "./TextArea.variants";

const TextArea: React.FC<TextAreaProps> = ({
  label,
  shape,
  error,
  className,
  maxLength,
  value,
  ...props
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-slate-700">{label}</span>
      )}

      <div className="relative">
        <textarea
          className={cn(
            textareaVariants({
              shape,
              error: Boolean(error),
              className,
            })
          )}
          {...props}
        />

        {maxLength && (
          <div className="text-xs text-slate-400 absolute bottom-3 right-3">
            {(value as string)?.length || 0}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextArea;
