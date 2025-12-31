import type { useDisclosureProps } from "@hooks/useDisclosure";

export interface DisclosureProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  defaultOpen: boolean;
  children: (props: useDisclosureProps) => React.ReactNode;
}
