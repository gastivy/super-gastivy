import React from "react";
import IcoMoon from "react-icomoon";

import type { IconProps } from "./Icon.types";
import iconSet from "./selection.json";

const Icon: React.FC<IconProps> = ({ size = "1.5rem", name, ...props }) => (
  <IcoMoon iconSet={iconSet} size={size} icon={name} {...props} />
);

export default Icon;
