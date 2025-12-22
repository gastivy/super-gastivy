export interface DropdownOption {
  label: string;
  value: string | number;
  [key: string]: unknown;
}

export interface DropdownProps {
  value?: string | number;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  options: DropdownOption[];
  onSelect: (value: string | number, option: DropdownOption) => void;
}
