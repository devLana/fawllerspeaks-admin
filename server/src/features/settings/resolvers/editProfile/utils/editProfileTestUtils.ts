import type { InputErrors } from "@types";

interface Input {
  [key: string]: unknown;
  firstName: string;
  lastName: string;
  image?: string | null;
}

type Validations = [string, Input, InputErrors<Input>][];

const image = "https://mock_test_data_image_link/image.png";
export const args = { firstName: "Ade", lastName: "Lana" };
export const dateCreated = "2022-11-07 13:22:43.717+01";
export const mockDate = "2022-11-07T12:22:43.717Z";

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "Provided input values are empty strings, Return an error response",
    { firstName: "", lastName: "", image: "" },
    {
      firstNameError: "Enter first name",
      lastNameError: "Enter last name",
      imageError: "Profile image url cannot be empty",
    },
  ],
  [
    "Return an error response if input values are empty whitespace strings",
    { firstName: "    ", lastName: "   ", image: "       " },
    {
      firstNameError: "Enter first name",
      lastNameError: "Enter last name",
      imageError: "Profile image url cannot be empty",
    },
  ],
  [
    "First name and last name input values are invalid, Return an error response",
    { firstName: "John3", lastName: "12sam" },
    {
      firstNameError: "First name cannot contain numbers",
      lastNameError: "Last name cannot contain numbers",
      imageError: nullOrUndefined,
    },
  ],
  [
    "Should return an error response if image string is not a valid uri string",
    { firstName: "John", lastName: "Sam", image: "not_a_valid_uri_string" },
    {
      firstNameError: nullOrUndefined,
      lastNameError: nullOrUndefined,
      imageError: "Profile image url is not a valid link",
    },
  ],
];

export const gqlValidate: [string, Record<string, unknown>][] = [
  [
    "Should respond with a graphql validation error for object and undefined input values",
    { firstName: null, lastName: {}, image: [] },
  ],
  [
    "Should respond with a graphql validation error for number and boolean input values",
    { firstName: 754, lastName: false, image: true },
  ],
];

export const verify: [string, Record<string, boolean>[]][] = [
  ["Returns error on unknown user", []],
  ["Returns error on unregistered user", [{ isRegistered: false }]],
];

export const editSuccess: [string, Input, string | null][] = [
  ["Should edit user profile without an image", args, null],
  ["Should edit user profile with an image", { ...args, image }, image],
  [
    "Edit's user profile and deletes image link",
    { ...args, image: null },
    null,
  ],
];

export const edit: [string, Input, string | null][] = [
  ["Edit user's profile without an image", args, null],
  ["Edit user's profile with an image", { ...args, image }, image],
  [
    "Should edit user's profile and remove image link",
    { ...args, image: null },
    null,
  ],
];
