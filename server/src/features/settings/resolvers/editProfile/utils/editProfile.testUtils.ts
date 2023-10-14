import supabase from "@lib/supabase/supabaseClient";
import type { InputErrors } from "@types";

interface Input {
  [key: string]: unknown;
  firstName: string;
  lastName: string;
  image?: string | null;
}

type Validations = [string, Input, InputErrors<Input>][];

const image = "folder/image-folder/image.png";
const { storageUrl } = supabase();

export const args = { firstName: "Ade", lastName: "Lana" };
export const dateCreated = "2022-11-07 13:22:43.717+01";

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
  ["Should return an error response if user is unknown", []],
  [
    "Should return an error response if user is unregistered",
    [{ isRegistered: false }],
  ],
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
  [
    "Edit user's profile with an image",
    { ...args, image },
    `${storageUrl}${image}`,
  ],
  [
    "Should edit user's profile and remove image link",
    { ...args, image: null },
    null,
  ],
];
