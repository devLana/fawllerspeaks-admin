export const metadataTextBoxes = [
  {
    id: "title",
    label: "Post Title",
    hint: "The new blog post title",
    hasOnInput: true,
  },
  {
    id: "description",
    label: "Post Description",
    hint: "A short overview of the post to be used by search engines",
    hasOnInput: false,
  },
  {
    id: "excerpt",
    label: "Post Excerpt",
    hint: "A brief summary of the post content",
    hasOnInput: false,
  },
] as const;
