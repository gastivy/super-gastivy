import * as React from "react";

export interface useDisclosureProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

function useDisclosure({
  open = false,
}: {
  open: boolean;
}): useDisclosureProps {
  const [isOpen, setIsOpen] = React.useState<boolean>(open);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen((val) => !val);

  return { isOpen, onOpen, onClose, onToggle };
}

export default useDisclosure;
