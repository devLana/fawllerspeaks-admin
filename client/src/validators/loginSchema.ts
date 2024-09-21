import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .email("Invalid e-mail address")
      .required("Enter an e-mail address")
      .trim("Enter an e-mail address"),
    password: yup.string().required("Enter password"),
  })
  .required("Provide login credentials");
