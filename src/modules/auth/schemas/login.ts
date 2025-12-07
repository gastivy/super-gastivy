import * as yup from "yup";

export type FormLogin = yup.InferType<typeof schemaLogin>;

export const schemaLogin = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at least 32 characters")
    .required("Password is required"),
});
