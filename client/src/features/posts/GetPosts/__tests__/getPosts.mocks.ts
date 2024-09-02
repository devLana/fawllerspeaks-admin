export const redirectStatus: [string, string, string][] = [
  [
    "Should display an alert toast if the user is unauthenticated",
    "/posts?image=draft-upload-error",
    "Blog post saved as draft. But there was an error uploading your post image banner. Please try uploading an image later",
  ],
  [
    "When a redirect happens from the create posts page with a create post image upload error, Expect an alert toast notification to be displayed",
    "/posts?image=create-upload-error",
    "Blog post created and published. But there was an error uploading your post image banner. Please try uploading an image later",
  ],
];
