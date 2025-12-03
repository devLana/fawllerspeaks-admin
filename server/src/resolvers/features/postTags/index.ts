import createPostTags from "./createPostTags";
import deletePostTags from "./deletePostTags";
import editPostTag from "./editPostTag";
import getPostTags from "./getPostTags";

export const postTagsResolvers = {
  Query: { getPostTags },
  Mutations: { createPostTags, editPostTag, deletePostTags },
};
