export interface TimeHoursProps {
  value: number;
  label?: string;
  error?: string;
  wrapperClassName?: string;
  onChange: (val: number) => void;
}
