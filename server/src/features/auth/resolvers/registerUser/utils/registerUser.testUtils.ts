import type { InputErrors } from "@types";

interface Input {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

type Validations = [string, Input, InputErrors<Input>][];

interface GQL {
  firstName: number | undefined;
  lastName: boolean | null;
  password: number | null;
  confirmPassword: boolean | undefined;
}

export const args = {
  firstName: "Johnson",
  lastName: "Simpson",
  password: "abcdEf65#",
  confirmPassword: "abcdEf65#",
};

export const userInput = {
  firstName: "Bart",
  lastName: "Simpson",
  password: "abcdEf65#",
  confirmPassword: "abcdEf65#",
};

export const dateCreated = "2022-11-07 13:22:43.717+01";

export const validations = (nullOrUndefined: null | undefined): Validations => [
  [
    "Invalid first name, last name, password and confirmPassword mismatch, Return an error response",
    {
      firstName: "Joe1234",
      lastName: "89Fred  ",
      password: "sD2$",
      confirmPassword: "",
    },
    {
      firstNameError: "First name contains an invalid character",
      lastNameError: "Last name contains an invalid character",
      passwordError: "Password must be at least 8 characters long",
      confirmPasswordError: "Passwords do not match",
    },
  ],
  [
    "Should return an error response if the input values are empty strings",
    {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    {
      firstNameError: "Enter first name",
      lastNameError: "Enter last name",
      passwordError: "Enter password",
      confirmPasswordError: nullOrUndefined,
    },
  ],
  [
    "Should return an error response if the input values are empty whitespace strings",
    {
      firstName: "  ",
      lastName: "      ",
      password: "              ",
      confirmPassword: "  ",
    },
    {
      firstNameError: "Enter first name",
      lastNameError: "Enter last name",
      passwordError:
        "Password must contain at least one number, one lowercase & one uppercase letter, and one special character or symbol",
      confirmPasswordError: "Passwords do not match",
    },
  ],
  [
    "Should return an error response if the confirm password does not match the password",
    {
      firstName: "Ádël Õmàri",
      lastName: "Jake-Jackson",
      password: "icbm73J_",
      confirmPassword: "jru73_",
    },
    {
      firstNameError: nullOrUndefined,
      lastNameError: nullOrUndefined,
      passwordError: nullOrUndefined,
      confirmPasswordError: "Passwords do not match",
    },
  ],
];

export const verifyUser: [string, Record<string, unknown>[], string][] = [
  [
    "Should return an error response if the user is unknown",
    [],
    "Unable to register user",
  ],
  [
    "User is already registered, Return an error response",
    [{ isRegistered: true }],
    "User is already registered",
  ],
];

export const gqlValidation: [string, GQL][] = [
  [
    "Should throw a graphql validation error if the input values are null or undefined",
    {
      firstName: undefined,
      lastName: null,
      password: null,
      confirmPassword: undefined,
    },
  ],
  [
    "Should throw a graphql validation error if the input values are number or boolean",
    { firstName: 698, lastName: true, password: 995, confirmPassword: false },
  ],
];

export const registerMock = [
  { isRegistered: false, email: "test@mail.com", image: null, dateCreated },
];
