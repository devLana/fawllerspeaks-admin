import * as yup from "yup";

export const schema = yup
  .object({
    name: yup.string().required("Provide name").trim("Provide name"),
    age: yup
      .number()
      .typeError("Enter your age")
      .required("Enter your age")
      .min(18),
    email: yup
      .string()
      .required("Email required")
      .trim("Email required")
      .email("Invalid email entered"),
    title: yup.string().required("Select a title").oneOf(["Mr", "Mrs", "Miss"]),
    hobbies: yup
      .array()
      .transform((value: string | string[] | undefined) => {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") return [value];
        return value;
      })
      .defined("No hobby selected")
      .of(yup.string().ensure())
      .max(3, "Only three hobbies allowed"),
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
