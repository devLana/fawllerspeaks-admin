const dateCreated = "2022-11-07 13:22:43.717+01";
const lastModified = "2022-12-15 02:00:15.126+01";

export const tags = [
  { id: "1", name: "tag1", dateCreated, lastModified: null },
  { id: "2", name: "tag2", dateCreated, lastModified },
];

export const verifyUser: [string, Record<string, boolean>[]][] = [
  ["Should return an error response if the user is unknown", []],
  [
    "Should return an error response if the user is unregistered",
    [{ isRegistered: false }],
  ],
];
