import type { InputErrors } from "@appTypes/tests";
import type { QueryGetPostsArgs as Args } from "@appTypes/resolverTypes";

type IntErrors = InputErrors<NonNullable<Args>>;

export const e2eValidations: Array<[string, Args, IntErrors]> = [
  [
    "Expect a validation error when the after cursor is an empty string and page size is less than 6",
    { after: "", size: 3, sort: "title_asc", status: "Published" },
    {
      afterError: "Posts pagination after cursor cannot be an empty string",
      sizeError: "Posts pagination page size must be at least 6",
      sortError: null,
      statusError: null,
    },
  ],
  [
    "Expect a validation error when the after cursor is an empty whitespace string and page size is more than 30",
    { after: "   ", size: 56, sort: "date_desc", status: "Draft" },
    {
      afterError: "Posts pagination after cursor cannot be an empty string",
      sizeError: "Posts pagination page size is too large. Maximum is 30",
      sortError: null,
      statusError: null,
    },
  ],
];

export const page: Args = { after: "YnVmZmVy", sort: "date_asc" };
export const e2eFilters1: Args = { status: "Draft", sort: "date_asc", size: 6 };

export const e2eFilters2: Args = {
  after: "YnVmZmVy",
  sort: "title_desc",
  status: "Unpublished",
  size: 30,
};
