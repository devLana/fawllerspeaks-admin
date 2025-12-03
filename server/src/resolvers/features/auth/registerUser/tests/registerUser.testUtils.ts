import type { InputErrors } from "types/tests";

interface Input {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export const userInput = {
  firstName: "Bart",
  lastName: "Simpson",
  password: "abcdEf65#",
  confirmPassword: "abcdEf65#",
};

export const validations: [string, Input, InputErrors<Input>][] = [
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
      confirmPasswordError: null,
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
      firstNameError: null,
      lastNameError: null,
      passwordError: null,
      confirmPasswordError: "Passwords do not match",
    },
  ],
];
