import * as yup from "yup";

export const editProfileValidator = yup
  .object({
    firstName: yup
      .string()
      .required("Enter first name")
      .trim("Enter first name"),
    lastName: yup.string().required("Enter last name").trim("Enter last name"),
  })
  .required("Provide profile details");
