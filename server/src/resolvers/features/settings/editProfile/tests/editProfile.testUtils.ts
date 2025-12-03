import { storageUrl } from "@services/supabase";
import { registeredUser } from "@utils/tests/mocks";
import type { InputErrors } from "types/tests";

interface Input {
  firstName: string;
  lastName: string;
  image?: string | null;
}

export const image = "folder/image-folder/image.png";
export const args = { firstName: "Jõhn-Döe", lastName: "Smíth" };

export const validations: [string, Input, InputErrors<Input>][] = [
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
      imageError: null,
    },
  ],
];

export const storageImage = `${storageUrl}${registeredUser.image}`;
export const userImage = `${storageUrl}${image}`;
