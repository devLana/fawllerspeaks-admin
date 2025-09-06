import * as yup from "yup";

export const getPostsSchema = yup.object({
  after: yup.string(),
  size: yup
    .number()
    .transform((val: unknown) => {
      const size = Number(val);

      if (Number.isNaN(size)) return val;

      const remainder = size % 6;
      return remainder === 0 ? size : size - remainder;
    })
    .min(6)
    .max(30),
  sort: yup
    .string()
    .transform((value: unknown) => {
      if (typeof value !== "string") return value;
      return value.toLowerCase();
    })
    .oneOf(["date_desc", "date_asc", "title_asc", "title_desc"])
    .optional(),
  status: yup
    .string()
    .transform((val: unknown) => {
      if (typeof val !== "string") return val;
      return `${val.charAt(0).toUpperCase()}${val.slice(1).toLowerCase()}`;
    })
    .oneOf(["Draft", "Published", "Unpublished"])
    .optional(),
});
