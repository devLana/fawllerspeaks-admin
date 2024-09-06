import * as yup from "yup";

export const forgotPasswordSchema = yup
  .object({
    email: yup
      .string()
      .email("Invalid e-mail address")
      .required("Enter an e-mail address")
      .trim("Enter an e-mail address"),
  })
  .required("Provide email address");
