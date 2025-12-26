export interface SwitchProps {
  enabled?: boolean;
  className?: string;
  label?: string;
  onChange?: (enabled: boolean) => void;
}
