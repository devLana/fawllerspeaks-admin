import { storageUrl } from "@services/supabase";

export const images = [
  `${storageUrl}path/to/image/file.jpg`,
  "https://www.example.com",
  "https://www.test.com",
  `${storageUrl}storage/path/to/image/avatar/file.png`,
  "https://testing.com",
];

export const validations: Array<[string, string[], string]> = [
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
