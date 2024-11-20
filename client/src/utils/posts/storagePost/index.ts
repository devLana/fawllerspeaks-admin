import type { StoragePostData } from "types/posts/createPost";

export const STORAGE_POST = "storage_post";

export const getStoragePost = (): StoragePostData | null => {
  const storagePost = localStorage.getItem(STORAGE_POST);

  if (!storagePost) return null;

  try {
    const post = JSON.parse(storagePost) as StoragePostData;

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

export const saveStoragePost = (post: StoragePostData) => {
  const savedPost = getStoragePost();
  let postToSave: string;

  const postDraft: StoragePostData = {
    ...(post.title && { title: post.title }),
    ...(post.description && { description: post.description }),
    ...(post.excerpt && { excerpt: post.excerpt }),
    ...(post.content && { content: post.content }),
    ...(post.tagIds && Array.isArray(post.tagIds) && { tagIds: post.tagIds }),
  };

  if (savedPost) {
    postToSave = JSON.stringify({ ...savedPost, ...postDraft });
  } else {
    postToSave = JSON.stringify(postDraft);
  }

  localStorage.setItem(STORAGE_POST, postToSave);
};
