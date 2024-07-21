import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";

import { SinglePost } from "../types/SinglePost";
import { DuplicatePostTitleError } from "../types/DuplicatePostTitleError";
import { PostValidationError } from "../types/PostValidationError";
import {
  AuthenticationError,
  ForbiddenError,
  NotAllowedError,
  RegistrationError,
  UnknownError,
} from "@utils/ObjectTypes";

import getPostTags from "@features/posts/utils/getPostTags";
import getPostSlug from "@features/posts/utils/getPostSlug";

import { draftPostSchema as schema } from "./utils/draftPost.validator";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";

import type { MutationResolvers, PostTag } from "@resolverTypes";
import type { ResolverFunc, PostDBData, ValidationErrorObject } from "@types";

type DraftPost = ResolverFunc<MutationResolvers["draftPost"]>;

interface User {
  isRegistered: boolean;
  name: string;
  image: string | null;
}

const draftPost: DraftPost = async (_, { post }, { db, user, req, res }) => {
  try {
    if (!user) {
      await deleteSession(db, req, res);
      if (post.imageBanner) supabaseEvent.emit("removeImage", post.imageBanner);
      return new AuthenticationError("Unable to save post to draft");
    }

    const input = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, excerpt, content, tagIds, imageBanner } = input;
    const slug = getPostSlug(title);

    const findUser = db.query<User>(
      `SELECT
        is_registered "isRegistered",
        concat(first_name,' ', last_name) name,
        image
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    const findTitleSlug = db.query<{ slug: string }>(
      `SELECT slug
      FROM posts
      WHERE lower(replace(replace(replace(title, '-', ''), ' ', ''), '_', '')) = $1
      OR slug = $2`,
      [title.toLowerCase().replace(/[\s_-]/g, ""), slug]
    );

    const [{ rows: foundUser }, { rows: foundTitleSlug }] = await Promise.all([
      findUser,
      findTitleSlug,
    ]);

    if (foundUser.length === 0) {
      await deleteSession(db, req, res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedError("Unable to save post to draft");
    }

    const [{ name, image, isRegistered }] = foundUser;

    if (!isRegistered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new RegistrationError("Unable to save post to draft");
    }

    if (foundTitleSlug.length > 0) {
      const [{ slug: savedSlug }] = foundTitleSlug;

      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);

      if (savedSlug === slug) {
        return new ForbiddenError(
          "The generated url slug for the provided post title already exists. Please ensure every post has a unique title"
        );
      }

      return new DuplicatePostTitleError(
        "A post with that title has already been created"
      );
    }

    let postTags: PostTag[] | null = null;

    if (tagIds) {
      const gottenTags = await getPostTags(db, tagIds);

      if (!gottenTags || gottenTags.length < tagIds.length) {
        if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
        return new UnknownError("Unknown post tag id provided");
      }

      postTags = gottenTags;
    }

    const { rows: draftedPost } = await db.query<PostDBData>(
      `INSERT INTO posts (
        title,
        description,
        excerpt,
        content,
        slug,
        author,
        status,
        image_banner
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        post_id "postId",
        date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        is_in_bin "isInBin",
        is_deleted "isDeleted"`,
      [title, description, excerpt, content, slug, user, "Draft", imageBanner]
    );

    const [drafted] = draftedPost;

    if (tagIds) {
      void db.query(
        `UPDATE post_tags
        SET posts = array_append(posts, $1)
        WHERE tag_id = ANY ($2)`,
        [drafted.id, tagIds]
      );
    }

    return new SinglePost({
      id: drafted.postId,
      title,
      description,
      excerpt,
      content,
      author: { name, image },
      status: "Draft",
      url: slug,
      imageBanner,
      dateCreated: drafted.dateCreated,
      datePublished: drafted.datePublished,
      lastModified: drafted.lastModified,
      views: drafted.views,
      isInBin: drafted.isInBin,
      isDeleted: drafted.isDeleted,
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

    throw new GraphQLError(
      "Unable to save post to draft. Please try again later"
    );
  }
};

export default draftPost;
