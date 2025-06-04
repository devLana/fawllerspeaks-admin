import type { CreateStoragePostData } from "types/posts/createPost";

export const CREATE_STORAGE_POST = "create_storage_post";

export const getCreateStoragePost = (): CreateStoragePostData | null => {
  const storagePost = localStorage.getItem(CREATE_STORAGE_POST);

  if (!storagePost) return null;

  try {
    const post = JSON.parse(storagePost) as CreateStoragePostData;

    if (
      !Object.hasOwn(post, "title") &&
      !Object.hasOwn(post, "description") &&
      !Object.hasOwn(post, "excerpt") &&
      !Object.hasOwn(post, "tagIds") &&
      !Object.hasOwn(post, "content")
    ) {
      return null;
    }

    return {
      ...(post.title && { title: post.title }),
      ...(post.description && { description: post.description }),
      ...(post.excerpt && { excerpt: post.excerpt }),
      ...(post.content && { content: post.content }),
      ...(post.tagIds && Array.isArray(post.tagIds) && { tagIds: post.tagIds }),
    };
  } catch {
    return null;
  }
};

export const saveCreateStoragePost = (post: CreateStoragePostData) => {
  const savedPost = getCreateStoragePost();
  let postToSave: string;

  const postDraft: CreateStoragePostData = {
    ...(post.title && { title: post.title }),
    ...(post.description && { description: post.description }),
    ...(post.excerpt && { excerpt: post.excerpt }),
    ...(post.content && { content: post.content }),
    ...(post.tagIds && Array.isArray(post.tagIds) && { tagIds: post.tagIds }),
  };

  if (savedPost) {
    let postData = { ...savedPost, ...postDraft };

    if (post.content === "") {
      const { content: _, ...rest } = postData;
      postData = rest;
    }

    postToSave = JSON.stringify(postData);
  } else {
    postToSave = JSON.stringify(postDraft);
  }

  localStorage.setItem(CREATE_STORAGE_POST, postToSave);
};
