import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import getPostTags from "@features/posts/utils/getPostTags";
import getPostUrl from "@features/posts/utils/getPostUrl";
import { createPostValidator as schema } from "./utils/createPost.validator";
import { SinglePost } from "../types/SinglePost";
import { DuplicatePostTitleError } from "../types/DuplicatePostTitleError";
import { PostValidationError } from "../types/PostValidationError";
import {
  AuthenticationError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";
import generateErrorsObject from "@utils/generateErrorsObject";

import type { MutationResolvers, PostTag } from "@resolverTypes";
import type { ResolverFunc, PostDBData, ValidationErrorObject } from "@types";

type CreatePost = ResolverFunc<MutationResolvers["createPost"]>;

interface User {
  isRegistered: boolean;
  image: string | null;
  name: string;
}

const createPost: CreatePost = async (_, { post }, { db, user }) => {
  if (!user) {
    if (post.imageBanner) supabaseEvent.emit("removeImage", post.imageBanner);
    return new AuthenticationError("Unable to create post");
  }

  try {
    const validated = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, content, tags, imageBanner } = validated;

    const checkUser = db.query<User>(
      `SELECT
        is_registered "isRegistered",
        image,
        concat(first_name,' ', last_name) name
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    const checkTitle = db.query(
      `SELECT id
      FROM posts
      WHERE lower(replace(replace(replace(title, '-', ''), ' ', ''), '_', '')) = $1`,
      [title.toLowerCase().replace(/[\s_-]/g, "")]
    );

    const [foundUser, foundTitle] = await Promise.all([checkUser, checkTitle]);
    const { rows: loggedInUser } = foundUser;
    const { rows: savedTitle } = foundTitle;

    if (loggedInUser.length === 0) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedError("Unable to create post");
    }

    const [{ name, image, isRegistered }] = loggedInUser;

    if (!isRegistered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new RegistrationError("Unable to create post");
    }

    if (savedTitle.length > 0) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);

      return new DuplicatePostTitleError(
        "A post with that title has already been created"
      );
    }

    let postTags: PostTag[] | null = null;
    let passedTags: readonly string[] | null = null;

    if (tags) {
      const gottenTags = await getPostTags(db, tags);

      if (!gottenTags || gottenTags.length < tags.length) {
        if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
        return new UnknownError("Unknown post tag id provided");
      }

      postTags = gottenTags;
      passedTags = tags;
    }

    const { rows: savedPost } = await db.query<PostDBData>(
      `INSERT INTO posts (
        title,
        description,
        content,
        author,
        status,
        image_banner,
        date_published
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING
        id,
        post_id "postId",
        date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        is_in_bin "isInBin",
        is_deleted "isDeleted"`,
      [
        title,
        description,
        content,
        user,
        "Published",
        imageBanner,
        new Date().toISOString(),
      ]
    );

    const [saved] = savedPost;

    if (passedTags && passedTags.length > 0) {
      void db.query(
        `UPDATE post_tags
        SET posts = array_append(posts, $1)
        WHERE tag_id = ANY ($2)`,
        [saved.id, passedTags]
      );
    }

    const { url, slug } = getPostUrl(title);

    return new SinglePost({
      id: saved.postId,
      title,
      description,
      content,
      author: { name, image },
      status: "Published",
      url,
      slug,
      imageBanner,
      dateCreated: saved.dateCreated,
      datePublished: saved.datePublished,
      lastModified: saved.lastModified,
      views: saved.views,
      isInBin: saved.isInBin,
      isDeleted: saved.isDeleted,
      tags: postTags,
    });
  } catch (err) {
    if (post.imageBanner) supabaseEvent.emit("removeImage", post.imageBanner);

    if (err instanceof ValidationError) {
      const errors = generateErrorsObject(err.details) as ValidationErrorObject<
        typeof post
      >;

      return new PostValidationError(errors);
    }

    throw new GraphQLError("Unable to create post. Please try again later");
  }
};

export default createPost;
