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
    "Should return a validation error for an array input that exceeds the maximum limit of 10",
    ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k"],
    "Input tags can only contain at most 10 tags",
  ],
  [
    "Should return a validation error for an empty input array",
    [],
    "No post tags were provided",
  ],
  [
    "Should return a validation error for an array of empty strings & empty whitespace strings",
    ["", "   "],
    "Input tags cannot contain empty values",
  ],
  [
    "Should return a validation error for an array of duplicate input strings",
    ["tag a", "tagA", "b"],
    "Input tags can only contain unique tags",
  ],
];

const dateCreated = "2022-11-07 13:22:43.717+01";

export const tags = ["tag1", "tag2", "tag3", "tag4"];

export const tag1 = {
  id: "100",
  name: tags[0],
  dateCreated,
  lastModified: null,
};
export const tag2 = {
  id: "500",
  name: tags[1],
  dateCreated,
  lastModified: null,
};
export const tag3 = {
  id: "21",
  name: tags[2],
  dateCreated,
  lastModified: null,
};
export const tag4 = {
  id: "436921",
  name: tags[3],
  dateCreated,
  lastModified: null,
};

const existingPostTags = [
  { name: tags[0] },
  { name: tags[1] },
  { name: tags[2] },
  { name: tags[3] },
];

export const verify: [string, Record<string, boolean>[], string[], string][] = [
  [
    "Should return an error response if the user is unknown",
    [],
    ["tag1", "tag2"],
    "tags",
  ],
  [
    "Should return an error response if the user is unregistered",
    [{ isRegistered: false }],
    ["tag1"],
    "tag",
  ],
];

export const warn: [string, string[], string[], string][] = [
  [
    "Should create new post tags and respond with a warning message if only one input post tag already exists",
    ["test POST_tag-3", "tag4", "tag5"],
    ["tag4", "tag5"],
    "2 post tags created. A post tag similar to 'test POST_tag-3' has already been created",
  ],
  [
    "Should create new post tags and respond with a warning message if more than one input post tag already exists",
    ["tag_4", "tag-5", "TAG 6", "tag 7"],
    ["TAG 6", "tag 7"],
    "2 post tags created. Post tags similar to 'tag_4' and 1 other post tag have already been created",
  ],
];

export const duplicate: [string, string[], string][] = [
  [
    "Should respond with an error if all the provided input post tags already exist",
    ["tag1", "tag2", "tag 4", "tAg_5", "tag-6"],
    "Post tags similar to the ones provided have already been created",
  ],
  [
    "Should respond with an error if the only provided input post tag already exists",
    ["t_a-g 7"],
    "A post tag similar to the one provided has already been created",
  ],
];

export const testWarn: [
  string,
  Record<string, unknown>[][],
  Record<string, unknown>[],
  string
][] = [
  [
    "Should create new post tags and return a warning message if more than one input post tag already exists",
    [
      [{ name: tags[0] }, { name: tags[1] }],
      [tag3, tag4],
    ],
    [tag3, tag4],
    "2 post tags created. Post tags similar to 'tag1' and 1 other post tag have already been created",
  ],
  [
    "Should create new post tags and return a warning message if at least one of the provided input post tags already exists",
    [[{ name: tags[0] }], [tag2, tag3, tag4]],
    [tag2, tag3, tag4],
    "3 post tags created. A post tag similar to 'tag1' has already been created",
  ],
];

export const testDuplicate: [string, string[], { name: string }[], string][] = [
  [
    "Should return an error response if all the provided input post tags already exist",
    tags,
    existingPostTags,
    "Post tags similar to the ones provided have already been created",
  ],
  [
    "Should return an error response if the only provided input post tag already exists",
    [tags[1]],
    [existingPostTags[1]],
    "A post tag similar to the one provided has already been created",
  ],
];
