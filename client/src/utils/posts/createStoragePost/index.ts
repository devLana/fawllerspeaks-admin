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
  const postData = getCreateStoragePost() ?? {};

  if (post.title) {
    postData.title = post.title;
  } else if (post.title === "") {
    delete postData.title;
  }

  if (post.description) {
    postData.description = post.description;
  } else if (post.description === "") {
    delete postData.description;
  }

  if (post.excerpt) {
    postData.excerpt = post.excerpt;
  } else if (post.excerpt === "") {
    delete postData.excerpt;
  }

  if (post.content) {
    postData.content = post.content;
  } else if (post.content === "") {
    delete postData.content;
  }

  if (post.tagIds && Array.isArray(post.tagIds)) {
    if (post.tagIds.length > 0) {
      postData.tagIds = post.tagIds;
    } else {
      delete postData.tagIds;
    }
  }

  localStorage.setItem(CREATE_STORAGE_POST, JSON.stringify(postData));
};
