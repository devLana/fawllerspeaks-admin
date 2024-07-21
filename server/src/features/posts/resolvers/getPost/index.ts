import { GraphQLError } from "graphql";
import Joi, { ValidationError } from "joi";

import { PostIdValidationError } from "../types/PostIdValidationError";
import { SinglePost } from "../types/SinglePost";
import { NotAllowedError, UnknownError } from "@utils/ObjectTypes";
import dateToISOString from "@utils/dateToISOString";
import getPostSlug from "@features/posts/utils/getPostSlug";
// import getPostTags  from "@features/posts/utils/getPostTags";

import type { PostAuthor, QueryResolvers } from "@resolverTypes";
import type { GetPostDBData, ResolverFunc } from "@types";

type GetPost = ResolverFunc<QueryResolvers["getPost"]>;
type Post = Omit<GetPostDBData, "postId"> & { author: PostAuthor };

const getPost: GetPost = async (_, { postId }, { user, db }) => {
  const schema = Joi.string()
    .required()
    .trim()
    .uuid({ version: "uuidv4", separator: "-" })
    .messages({
      "string.empty": "Provide post id",
      "string.guid": "Invalid post id provided",
    });

  try {
    if (!user) return new NotAllowedError("Unable to retrieve post");

    const post = await schema.validateAsync(postId);

    const checkUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    const findPost = db.query<Post>(
      `SELECT
        title,
        description,
        content,
        first_name || ' ' || last_name author,
        image,
        status,
        slug,
        image_banner "imageBanner",
        posts.date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        likes,
        is_in_bin "isInBin",
        is_deleted "isDeleted",
        tags
      FROM posts LEFT JOIN users ON author = user_id
      WHERE post_id = $1`,
      [post]
    );

    const [checkedUser, savedPost] = await Promise.all([checkUser, findPost]);
    const { rows: foundUser } = checkedUser;
    const { rows: foundPost } = savedPost;

    if (foundUser.length === 0 || !foundUser[0].isRegistered) {
      return new NotAllowedError("Unable to retrieve post");
    }

    if (foundPost.length === 0) {
      return new UnknownError("Unable to retrieve a post with that id");
    }

    const [found] = foundPost;

    const slug = getPostSlug(found.title);
    // const tags = found.tags ? await getPostTags(db, found.tags) : null;

    return new UnknownError("Unable to retrieve a post with that id");
    // return new SinglePost({
    //   id: post,
    //   title: found.title,
    //   description: found.description,
    //   content: null,
    //   author: found.author,
    //   status: found.status,
    //   url: { href, slug },
    //   imageBanner: found.imageBanner,
    //   dateCreated: dateToISOString(found.dateCreated),
    //   datePublished: found.datePublished
    //     ? dateToISOString(found.datePublished)
    //     : found.datePublished,
    //   lastModified: found.lastModified
    //     ? dateToISOString(found.lastModified)
    //     : found.lastModified,
    //   views: found.views,
    //   isInBin: found.isInBin,
    //   isDeleted: found.isDeleted,
    //   tags: null,
    // });
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdValidationError(err.message);
    }

    throw new GraphQLError("Unable to retrieve post. Please try again later");
  }
};

export default getPost;
