import * as Yup from "yup";

export const schemaActivity = Yup.object().shape({
  categoryActivity: Yup.string().required("Category Activity is Required"),
  startDate: Yup.date().required("Start Date is required"),
  startTime: Yup.string().required("Start Time is required"),
  seconds: Yup.number()
    .min(
      1,
      "At least one of seconds, minutes, or hours must be filled with a non-zero value"
    )
    .required(
      "At least one of seconds, minutes, or hours must be filled with a non-zero value"
    ),
  isDone: Yup.boolean().required(),
});

export const schemaActivities = Yup.object().shape({
  activities: Yup.array()
    .of(schemaActivity)
    .required("Activities are required"),
});
