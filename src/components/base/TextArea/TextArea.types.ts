import type { VariantProps } from "class-variance-authority";
import type { textareaVariants } from "./TextArea.variants";

export interface TextAreaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  shape?: VariantProps<typeof textareaVariants>["shape"];
  className?: string;
  error?: string;
  label?: string;
  maxLength?: number;
}
