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
} from "@utils/ObjectTypes";

import getPostSlug from "@features/posts/utils/getPostSlug";

import { draftPostSchema as schema } from "./utils/draftPost.validator";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, PostDBData } from "@types";

type DraftPost = ResolverFunc<MutationResolvers["draftPost"]>;

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

    const checkUser = db.query<{ isRegistered: boolean; author: string }>(
      `SELECT
        is_registered "isRegistered",
        concat(first_name,' ',last_name,' ',image) author
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    const checkTitleSlug = db.query<{ slug: string }>(
      `SELECT slug
      FROM posts
      WHERE regexp_replace(title, '[-_\\s]', '', 'g') ~* $1
      OR slug = $2`,
      [title.replace(/[\s_-]/g, ""), slug]
    );

    const [{ rows: loggedInUser }, { rows: savedTitleSlug }] =
      await Promise.all([checkUser, checkTitleSlug]);

    if (loggedInUser.length === 0) {
      await deleteSession(db, req, res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedError("Unable to save post to draft");
    }

    const [{ author, isRegistered }] = loggedInUser;

    if (!isRegistered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new RegistrationError("Unable to save post to draft");
    }

    if (savedTitleSlug.length > 0) {
      const [{ slug: savedSlug }] = savedTitleSlug;

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

    const dbTags = tagIds ? `{${tagIds.join(",")}}` : null;

    const { rows: draftedPost } = await db.query<PostDBData>(
      `WITH drafted_post AS (
        INSERT INTO posts (
          title,
          description,
          excerpt,
          content,
          slug,
          author,
          status,
          image_banner,
          tags
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'Draft', $7, $8)
        RETURNING
          post_id,
          date_created,
          date_published,
          last_modified,
          views,
          is_in_bin,
          is_deleted,
          tags
      )
      SELECT
        dp.post_id id,
        dp.date_created "dateCreated",
        dp.date_published "datePublished",
        dp.last_modified "lastModified",
        dp.views,
        dp.is_in_bin "isInBin",
        dp.is_deleted "isDeleted",
        json_agg(json_build_object(
          'id', pt.tag_id,
          'tagId', pt.id,
          'name', pt.name,
          'dateCreated', pt.date_created,
          'lastModified', pt.last_modified
        )) FILTER (WHERE pt.id IS NOT NULL) tags
      FROM drafted_post dp
      LEFT JOIN post_tags pt
      ON pt.id = ANY (dp.tags)
      GROUP BY
        dp.post_id,
        dp.date_created,
        dp.date_published,
        dp.last_modified,
        dp.views,
        dp.is_in_bin,
        dp.is_deleted`,
      [title, description, excerpt, content, slug, user, imageBanner, dbTags]
    );

    const [drafted] = draftedPost;

    return new SinglePost({
      id: drafted.id,
      title,
      description,
      excerpt,
      content,
      author,
      status: "Draft",
      url: slug,
      imageBanner,
      dateCreated: drafted.dateCreated,
      datePublished: drafted.datePublished,
      lastModified: drafted.lastModified,
      views: drafted.views,
      isInBin: drafted.isInBin,
      isDeleted: drafted.isDeleted,
      tags: drafted.tags,
    });
  } catch (err) {
    if (post.imageBanner) supabaseEvent.emit("removeImage", post.imageBanner);

    if (err instanceof ValidationError) {
      return new PostValidationError(generateErrorsObject(err.details));
    }

    throw new GraphQLError(
      "Unable to save post to draft. Please try again later"
    );
  }
};

export default draftPost;
