import * as Yup from "yup";

export const schemaCategory = Yup.object().shape({
  name: Yup.string()
    .min(1, "Category Name must be at least 1 characters long.")
    .max(30, "Category Name maximum 30 characters long.")
    .required("Name Category is required"),
  target: Yup.number()
    .min(1, "Target at least 1 minute")
    .required("Target is required"),
  start_date: Yup.date().required("Start Date is required"),
});
