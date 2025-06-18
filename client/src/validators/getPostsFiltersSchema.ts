import * as yup from "yup";

const func = (value: unknown) => {
  if (typeof value !== "string") return value;
  return value.toLowerCase();
};

export const getPostsFiltersSchema = yup.object({
  filters: yup
    .object({
      status: yup
        .string()
        .transform((val: unknown) => {
          if (typeof val !== "string") return val;
          return `${val.charAt(0).toUpperCase()}${val.slice(1).toLowerCase()}`;
        })
        .oneOf(["Draft", "Published", "Unpublished"])
        .optional(),
      sort: yup
        .string()
        .transform(func)
        .oneOf(["date_desc", "date_asc", "title_asc", "title_desc"])
        .optional(),
    })
    .optional()
    .default(undefined),
  page: yup
    .tuple([
      yup.string().transform(func).oneOf(["after", "before"]).required(),
      yup.string().required(),
    ])
    .optional(),
});
