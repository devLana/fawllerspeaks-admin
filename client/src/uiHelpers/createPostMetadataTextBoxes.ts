export const createPostMetadataTextBoxes = [
  {
    id: "title",
    label: "Post Title",
    hint: "A descriptive and unique blog post title that will also be used to generate the post's url slug",
  },
  {
    id: "description",
    label: "Post Description",
    hint: "A short descriptive text no more than 255 characters that will be used by search engines to describe this post",
  },
  {
    id: "excerpt",
    label: "Post Excerpt",
    hint: "A concise summary no more than 300 characters that explains the content of this post to readers",
  },
] as const;
