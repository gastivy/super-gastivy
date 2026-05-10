import { Children } from "react";

import type { EachProps } from "./Each.types";

const Each = <T,>({ of, render }: EachProps<T>) =>
  Children.toArray(of.map((item, index) => render(item, index)));

export default Each;
