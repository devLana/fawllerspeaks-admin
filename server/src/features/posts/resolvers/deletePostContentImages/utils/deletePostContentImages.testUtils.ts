import supabase from "@lib/supabase/supabaseClient";

export const images = [
  `${supabase().storageUrl}path/to/image/file.jpg`,
  "https://www.example.com",
  "https://www.test.com",
  `${supabase().storageUrl}storage/path/to/image/avatar/file.png`,
  "https://testing.com",
];

export const gqlValidations: [string, unknown][] = [
  ["Should throw a graphql validation error for a null input array", null],
  [
    "Should throw a graphql validation error for an undefined input array",
    undefined,
  ],
  ["Should throw a graphql validation error for a boolean input array", true],
  ["Should throw a graphql validation error for a number input array", 100],
  [
    "Should throw a graphql validation error for an array with invalid inputs",
    [false, 90, {}, []],
  ],
];

export const validations: [string, string[], string][] = [
  [
    "Should return a validation error for an empty input array",
    [],
    "No post content image url was provided",
  ],
  [
    "Should return a validation error for an array of empty strings & empty whitespace strings",
    ["", "   "],
    "Post content image url cannot be an empty string",
  ],
  [
    "Should return a validation error if at least one of the image url strings provided is not a uri string",
    ["not a uri string", images[0]],
    "Invalid post content image url provided",
  ],
];

export const nonStorageUris = [images[1], images[2], images[4]];

export const storageUris = [
  "path/to/image/file.jpg",
  "storage/path/to/image/avatar/file.png",
];

export const verify: [string, Record<string, boolean>[]][] = [
  ["Should return an error response if the user is unknown", []],
  [
    "Should return an error response if the user is unregistered",
    [{ isRegistered: false }],
  ],
];
