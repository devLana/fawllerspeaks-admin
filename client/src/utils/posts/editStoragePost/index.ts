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

export const saveEditStoragePost = (post: Partial<EditStoragePostData>) => {
  const savedPost = getEditStoragePost() ?? {};
  const merged: Partial<EditStoragePostData> = { ...savedPost };

  if (post.id) {
    merged.id = post.id;
  }

  if (post.slug) {
    merged.slug = post.slug;
  }

  if (post.content) {
    merged.content = post.content;
  } else if (post.content === "") {
    delete merged.content;
  }

  if (post.imgUrls && Array.isArray(post.imgUrls)) {
    if (post.imgUrls.length > 0) {
      merged.imgUrls = post.imgUrls;
    } else {
      delete merged.imgUrls;
    }
  }

  localStorage.setItem(EDIT_STORAGE_POST, JSON.stringify(merged));
};
