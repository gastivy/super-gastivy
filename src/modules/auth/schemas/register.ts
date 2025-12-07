import * as yup from "yup";

export const schemaRegister = yup.object().shape({
  name: yup
    .string()
    .min(3, "Full name must be at least 3 characters")
    .required("Full name is required"),
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
