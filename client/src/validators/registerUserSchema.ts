import * as yup from "yup";

const message = `Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol`;

export const registerUserSchema = yup
  .object({
    firstName: yup
      .string()
      .required("Enter first name")
      .trim("Enter first name"),
    lastName: yup.string().required("Enter last name").trim("Enter last name"),
    password: yup
      .string()
      .matches(/\d+/, { message, excludeEmptyString: true })
      .matches(/[a-z]+/, { message, excludeEmptyString: true })
      .matches(/[A-Z]+/, { message, excludeEmptyString: true })
      .matches(/[^a-z\d]+/i, { message, excludeEmptyString: true })
      .min(8, "Password must be at least ${min} characters long")
      .required("Enter password"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Enter confirm password"),
  })
  .required("Provide registration details");
