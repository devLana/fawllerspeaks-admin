import * as yup from "yup";

const message =
  "New password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol";

export const changePasswordValidator = yup
  .object({
    currentPassword: yup.string().required("Enter current password"),
    newPassword: yup
      .string()
      .required("Enter new password")
      .min(8, "New Password must be at least ${min} characters long")
      .matches(/\d+/, message)
      .matches(/[a-z]+/, message)
      .matches(/[A-Z]+/, message)
      .matches(/[^a-z\d]+/i, message),
    confirmNewPassword: yup
      .string()
      .required("Enter confirm password")
      .oneOf([yup.ref("newPassword")], "Passwords do not match"),
  })
  .required("Provide password details");
