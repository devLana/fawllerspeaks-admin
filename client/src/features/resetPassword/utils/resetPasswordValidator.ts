import * as yup from "yup";

const message =
  "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

export const resetPasswordValidator = yup
  .object({
    password: yup
      .string()
      .required("Enter password")
      .min(8, "Password must be at least ${min} characters long")
      .matches(/\d+/, message)
      .matches(/[a-z]+/, message)
      .matches(/[A-Z]+/, message)
      .matches(/[^a-z\d]+/i, message),
    confirmPassword: yup
      .string()
      .required("Enter confirm password")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  })
  .required("Provide new password details");
