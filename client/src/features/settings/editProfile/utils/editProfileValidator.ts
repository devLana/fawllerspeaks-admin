import * as yup from "yup";

export const editProfileValidator = yup
  .object({
    firstName: yup
      .string()
      .required("Enter first name")
      .trim("Enter first name")
      .matches(/^[^\d]+$/, "First name cannot contain numbers"),
    lastName: yup
      .string()
      .required("Enter last name")
      .trim("Enter last name")
      .matches(/^[^\d]+$/, "Last name cannot contain numbers"),
  })
  .required("Provide profile details");
