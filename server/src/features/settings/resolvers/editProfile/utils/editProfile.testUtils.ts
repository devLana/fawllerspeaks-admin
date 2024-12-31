import supabase from "@lib/supabase/supabaseClient";
import { registeredUser } from "@tests/mocks";
import type { InputErrors } from "@types";

interface Input {
  firstName: string;
  lastName: string;
  image?: string | null;
}

type Validations = [string, Input, InputErrors<Input>][];

export const image = "folder/image-folder/image.png";
const { storageUrl } = supabase();
export const args = { firstName: "Jõhn-Döe", lastName: "Smíth" };
export const dateCreated = "2022-11-07 13:22:43.717+01";

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "The provided input values are empty strings, Should return a validation error response",
    { firstName: "", lastName: "", image: "" },
    {
      firstNameError: "Enter first name",
      lastNameError: "Enter last name",
      imageError: "Profile image url cannot be empty",
    },
  ],
  [
    "Should return a validation error response if input values are empty whitespace strings",
    { firstName: "    ", lastName: "   ", image: "       " },
    {
      firstNameError: "Enter first name",
      lastNameError: "Enter last name",
      imageError: "Profile image url cannot be empty",
    },
  ],
  [
    "First name and last name input values are invalid, Return a validation error response",
    { firstName: "John3", lastName: "12sam" },
    {
      firstNameError: "First name contains an invalid character",
      lastNameError: "Last name contains an invalid character",
      imageError: nullOrUndefined,
    },
  ],
];

export const verify: [string, Record<string, boolean>[]][] = [
  ["Should return an error response if user is unknown", []],
  [
    "Should return an error response if user is unregistered",
    [{ isRegistered: false }],
  ],
];

export const userData1 = { email: "it@mail.com", dateCreated, image: null };
export const userData2 = { email: "it@mail.com", dateCreated, image };
export const storageImage = `${storageUrl}${registeredUser.image}`;
export const userImage = `${storageUrl}${image}`;
