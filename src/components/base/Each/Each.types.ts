export type EachProps<T> = {
  of: T[];
  render: (item: T, index: number) => React.ReactNode;
};
