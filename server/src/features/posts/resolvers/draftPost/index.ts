import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import getPostSlug from "@features/posts/utils/getPostSlug";

import { SinglePost } from "../types/SinglePost";
import { DuplicatePostTitleError } from "../types/DuplicatePostTitleError";
import { PostValidationError } from "../types/PostValidationError";
import {
  AuthenticationError,
  ForbiddenError,
  NotAllowedError,
  RegistrationError,
} from "@utils/ObjectTypes";

import { draftPostSchema as schema } from "./utils/draftPost.validator";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, PostFieldResolver, PostDBData } from "@types";

type DraftPost = PostFieldResolver<
  ResolverFunc<MutationResolvers["draftPost"]>
>;

interface User {
  userId: string;
  isRegistered: boolean;
  authorName: string;
  authorImage: string | null;
}

const draftPost: DraftPost = async (_, { post }, { db, user, req, res }) => {
  const postImage = post.imageBanner && post.imageBanner.trim();

  try {
    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      void deleteSession(db, req, res);
      return new AuthenticationError("Unable to save post to draft");
    }

    const input = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, excerpt, content, tagIds, imageBanner } = input;
    const slug = getPostSlug(title);

    const { rows: loggedInUser } = await db.query<User>(
      `SELECT
        id "userId",
        is_registered "isRegistered",
        concat(first_name,' ',last_name) "authorName",
        image "authorImage"
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    if (loggedInUser.length === 0) {
      await deleteSession(db, req, res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedError("Unable to save post to draft");
    }

    const [{ userId, authorImage, authorName, isRegistered }] = loggedInUser;

    if (!isRegistered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new RegistrationError("Unable to save post to draft");
    }

    const { rows: checkSlug } = await db.query<{ slug: string; title: string }>(
      `SELECT slug, title
      FROM posts
      WHERE slug = $1 OR lower(title) = $2`,
      [slug, title.replace(/[\s_-]/g, "")]
    );

    if (checkSlug.length > 0) {
      const [{ slug: savedSlug, title: savedTitle }] = checkSlug;

      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);

      if (savedSlug === slug) {
        return new ForbiddenError(
          "It seems this post title generates a slug that already exists. Please ensure the provided title is as unique as possible"
        );
      }

      return new DuplicatePostTitleError(
        `A similar post title already exists - '${savedTitle}'. Please ensure every post has a unique title`
      );
    }

    const dbTags = tagIds ? `{${tagIds.join(",")}}` : null;

    const { rows: draftedPost } = await db.query<PostDBData>(
      `WITH draft_post AS (
        INSERT INTO posts (title, description, excerpt, slug, author, image_banner, status)
        VALUES ($1, $2, $3, $4, $5, $6, 'Draft')
        RETURNING *
      ),
      resolved_tags AS (
        SELECT id, tag_id, name, date_created, last_modified
        FROM post_tags
        WHERE tag_id = ANY (CAST($7 AS uuid[]))
      ),
      insert_tags AS (
        INSERT INTO post_tags_to_posts (post_id, tag_id)
        SELECT dp.id, rt.id
        FROM draft_post dp, resolved_tags rt
      ),
      insert_content AS (
        INSERT INTO post_contents (post_id, content)
        SELECT id, CAST($8 AS text)
        FROM draft_post
        WHERE CAST($8 AS text) IS NOT NULL
      )
      SELECT
        dp.post_id id,
        dp.slug,
        dp.title,
        dp.description,
        dp.excerpt,
        CAST($8 AS text) content,
        dp.image_banner "imageBanner",
        dp.status,
        dp.date_created "dateCreated",
        dp.date_published "datePublished",
        dp.last_modified "lastModified",
        dp.views,
        dp.is_in_bin "isInBin",
        dp.is_deleted "isDeleted",
        json_agg(
          json_build_object(
            'id', rt.tag_id,
            'name', rt.name,
            'dateCreated', rt.date_created,
            'lastModified', rt.last_modified
          )
        ) FILTER (WHERE rt.id IS NOT NULL) tags
      FROM draft_post dp
      LEFT JOIN resolved_tags rt ON TRUE
      GROUP BY
        dp.post_id,
        dp.slug,
        dp.title,
        dp.description,
        dp.excerpt,
        CAST($8 AS text),
        dp.image_banner,
        dp.status,
        dp.date_created,
        dp.date_published,
        dp.last_modified,
        dp.views,
        dp.is_in_bin,
        dp.is_deleted`,
      [title, description, excerpt, slug, userId, imageBanner, dbTags, content]
    );

    const [drafted] = draftedPost;

    return new SinglePost({
      id: drafted.id,
      title: drafted.title,
      description: drafted.description,
      excerpt: drafted.excerpt,
      content: drafted.content,
      author: { name: authorName, image: authorImage },
      status: "Draft",
      url: { slug: drafted.slug, href: drafted.slug },
      imageBanner: drafted.imageBanner,
      dateCreated: drafted.dateCreated,
      datePublished: drafted.datePublished,
      lastModified: drafted.lastModified,
      views: drafted.views,
      isInBin: drafted.isInBin,
      isDeleted: drafted.isDeleted,
      tags: drafted.tags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new PostValidationError(generateErrorsObject(err.details));
    }

    throw new GraphQLError(
      "Unable to save post to draft. Please try again later"
    );
  }
};

export default draftPost;
