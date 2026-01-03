import * as Yup from "yup";

export const schemaWallet = Yup.object().shape({
  name: Yup.string().required("Name Wallet is required"),
  type: Yup.number().required("Type Wallet is required"),
  balance: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .required("Balance Wallet is required")
    .min(0, "Balance must be at least 0"),
});
