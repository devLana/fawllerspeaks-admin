import * as yup from "yup";

export const useFormSchema = yup
  .object({
    name: yup.string().required("Provide name").trim("Provide name"),
    age: yup
      .number()
      .min(18)
      .required("Enter your age")
      .typeError("Enter your age"),
    email: yup
      .string()
      .email("Invalid email entered")
      .required("Email required")
      .trim("Email required"),
    title: yup.string().oneOf(["Mr", "Mrs", "Miss"]).required("Select a title"),
    hobbies: yup
      .array()
      .transform((value: string | string[] | undefined) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") return [value];
        return value;
      })
      .of(yup.string().ensure())
      .max(3, "Only three hobbies allowed")
      .defined("No hobby selected"),
    avatar: yup
      .mixed<File>()
      .defined()
      .test("avatar-img", function (value) {
        if (value.size === 0 || !value.name) {
          // return this.createError({ message: "Please select an image" });
          return true;
        }

        if (!value.type.startsWith("image/")) {
          return this.createError({
            message: "Only image files can be uploaded",
          });
        }

        return true;
      }),
  })
  .required("Provide fields");
