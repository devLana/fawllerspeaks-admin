type GQL = [
  string,
  boolean | number | [] | Record<string, unknown> | undefined | null
];

export const validations: [string, string][] = [
  ["Should return an error response if the session id is an empty string", ""],
  [
    "Should return an error response if the session id is an empty whitespace string",
    "      ",
  ],
];

export const gqlValidations: GQL[] = [
  ["Should throw a graphql validation error for a null session id value", null],
  [
    "Should throw a graphql validation error for an undefined session id value",
    undefined,
  ],
  ["Should throw a graphql validation error for a number session id value", 59],
  [
    "Should throw a graphql validation error for a boolean session id value",
    true,
  ],
  ["Should throw a graphql validation error for an array session id value", []],
  [
    "Should throw a graphql validation error for an object session id value",
    {},
  ],
];
