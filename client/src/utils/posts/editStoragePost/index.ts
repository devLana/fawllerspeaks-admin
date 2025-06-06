import type { EditStoragePostData } from "types/posts/editPost";

export const EDIT_STORAGE_POST = "edit_storage_post";

export const getEditStoragePost = (): EditStoragePostData | null => {
  const storagePost = localStorage.getItem(EDIT_STORAGE_POST);

  if (!storagePost) return null;

  try {
    const post = JSON.parse(storagePost) as EditStoragePostData;

    if (
      !Object.hasOwn(post, "id") &&
      !Object.hasOwn(post, "slug") &&
      !Object.hasOwn(post, "content") &&
      !Object.hasOwn(post, "imgUrls")
    ) {
      return null;
    }

    const { content, id, slug, imgUrls } = post;

    return { content, id, slug, imgUrls };
  } catch {
    return null;
  }
};

export const saveEditStoragePost = (post: EditStoragePostData) => {
  const savedPost = getEditStoragePost();
  let postToSave: string;

  const postDraft: EditStoragePostData = {
    ...(post.id && { id: post.id ?? "" }),
    ...(post.slug && { slug: post.slug ?? "" }),
    ...(post.content && { content: post.content }),
    ...(post.imgUrls && { imgUrls: post.imgUrls }),
  };

  if (savedPost) {
    let postData = { ...savedPost, ...postDraft };

    if (post.content === "") {
      const { content: _, ...rest } = postData;
      postData = rest;
    }

    if (post.imgUrls?.length === 0) {
      const { imgUrls: _, ...rest } = postData;
      postData = rest;
    }

    postToSave = JSON.stringify(postData);
  } else {
    postToSave = JSON.stringify(postDraft);
  }

  localStorage.setItem(EDIT_STORAGE_POST, postToSave);
};
