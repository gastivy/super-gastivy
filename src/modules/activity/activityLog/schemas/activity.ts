import * as Yup from "yup";

export const schemaActivity = Yup.object()
  .shape({
    categoryActivity: Yup.string().required("Category Activity is Required"),
    startDate: Yup.date().required("Start Date is required"),
    startTime: Yup.string().required("Start Time is required"),
    seconds: Yup.number(),
    minutes: Yup.number(),
    hours: Yup.number(),
    isDone: Yup.boolean().required(),
  })
  .test(
    "at-least-one-filled",
    "At least one of seconds, minutes, or hours must be filled with a non-zero value",
    function (value) {
      const { seconds, minutes, hours } = value;

      if (seconds === 0 && minutes === 0 && hours === 0) {
        return this.createError({
          path: "seconds",
          message:
            "At least one of seconds, minutes, or hours must be filled with a non-zero value",
        });
      }

      return true;
    }
  );
