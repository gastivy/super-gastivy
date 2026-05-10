import React from "react";

import type { ConditionalProps } from "./Conditional.types";

const Conditional: React.FC<ConditionalProps> = ({
  if: condition,
  reject,
  children,
}) => {
  if (!reject) {
    return condition && children;
  }

  return condition ? children : reject;
};

export default Conditional;
