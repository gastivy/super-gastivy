import type {
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

type SetValuesOptions = {
  shouldValidate?: boolean;
  shouldDirty?: boolean;
  shouldTouch?: boolean;
};

export function setValues<T extends FieldValues>(
  setValue: UseFormSetValue<T>,
  values: Partial<Record<Path<T>, PathValue<T, Path<T>>>>,
  options: SetValuesOptions = {
    shouldValidate: true,
    shouldDirty: true,
  }
) {
  Object.entries(values).forEach(([key, value]) => {
    setValue(key as Path<T>, value as PathValue<T, Path<T>>, options);
  });
}
