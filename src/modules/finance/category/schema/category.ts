import * as Yup from "yup";

export const schemaCategoryTransaction = Yup.object().shape({
  name: Yup.string().required("Name Category is required"),
  type: Yup.number().required("Target is required"),
});

export const schemaTransaction = Yup.object().shape({
  transactions: Yup.array()
    .of(
      Yup.object().shape({
        category_id: Yup.string().required("Category ID is required"),
        name: Yup.string().required("Name is required"),
        description: Yup.string(),
        fee: Yup.number(),
        money: Yup.number()
          .required("Money is required")
          .min(1, "Money must be at least 1"),
        date: Yup.date().required("Date is required"),
        type: Yup.number().required("Type is required"),
        from_wallet: Yup.string().when("type", (types: number[], schema) => {
          const type = types[0];
          if (typeof type === "number" && (type === 2 || type === 3)) {
            return schema.required("Origin Wallet is required");
          }
          return schema;
        }),
        to_wallet: Yup.string().when("type", (types: number[], schema) => {
          const type = types[0];
          if (typeof type === "number" && (type === 1 || type === 3)) {
            return schema.required("Destination Wallet is required");
          }
          return schema;
        }),
      })
    )
    .required("Transactions are required"),
});

export const schemaUpdateTransaction = Yup.object().shape({
  category_id: Yup.string().required("Category ID is required"),
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  fee: Yup.number(),
  money: Yup.number()
    .required("Money is required")
    .min(1, "Money must be at least 1"),
  date: Yup.date().required("Date is required"),
  type: Yup.number().required("Type is required"),
  from_wallet: Yup.string().when("type", (types: number[], schema) => {
    const type = types[0];
    if (typeof type === "number" && (type === 2 || type === 3)) {
      return schema.required("Origin Wallet is required");
    }
    return schema;
  }),
  to_wallet: Yup.string().when("type", (types: number[], schema) => {
    const type = types[0];
    if (typeof type === "number" && (type === 1 || type === 3)) {
      return schema.required("Destination Wallet is required");
    }
    return schema;
  }),
});
