import useDisclosure from "@hooks/useDisclosure";
import React from "react";
import type { DisclosureProps } from "./Disclosure.types";

const Disclosure: React.FC<DisclosureProps> = ({
  children,
  defaultOpen,
  ...props
}) => {
  const { isOpen, onToggle, ...propsDisclosure } = useDisclosure({
    open: defaultOpen,
  });
  return (
    <div {...props}>{children({ isOpen, onToggle, ...propsDisclosure })}</div>
  );
};

export default Disclosure;
