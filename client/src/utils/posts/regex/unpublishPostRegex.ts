export const unpublishPostRegex = new RegExp(
  '^getPosts\\(([^)]*"status":"(?:Published|Unpublished)"[^)]*)\\)$'
);
