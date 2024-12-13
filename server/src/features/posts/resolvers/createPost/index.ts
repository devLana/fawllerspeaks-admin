import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@lib/supabase/supabaseEvent";
import getPostSlug from "@features/posts/utils/getPostSlug";
import { createPostValidator as schema } from "./utils/createPost.validator";
import { SinglePost } from "../types/SinglePost";
import { DuplicatePostTitleError } from "../types/DuplicatePostTitleError";
import { PostValidationError } from "../types/PostValidationError";
import {
  AuthenticationError,
  ForbiddenError,
  NotAllowedError,
  RegistrationError,
} from "@utils/ObjectTypes";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";

import type { MutationResolvers } from "@resolverTypes";
import type { ResolverFunc, PostDBData, PostFieldResolver } from "@types";

type CreatePost = PostFieldResolver<
  ResolverFunc<MutationResolvers["createPost"]>
>;

interface User {
  isRegistered: boolean;
  authorName: string;
  authorImage: string | null;
}

const createPost: CreatePost = async (_, { post }, { db, user, req, res }) => {
  try {
    if (!user) {
      await deleteSession(db, req, res);
      if (post.imageBanner) supabaseEvent.emit("removeImage", post.imageBanner);
      return new AuthenticationError("Unable to create post");
    }

    const input = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, excerpt, content, tagIds, imageBanner } = input;
    const slug = getPostSlug(title);

    const checkUser = db.query<User>(
      `SELECT
        is_registered "isRegistered",
        concat(first_name,' ',last_name) "authorName",
        image "authorImage"
      FROM users
      WHERE user_id = $1`,
      [user]
    );

    const checkTitleSlug = db.query<{ slug: string; title: string }>(
      `SELECT slug, title
      FROM posts
      WHERE slug = $1 OR lower(title) = $2`,
      [slug, title.toLowerCase()]
    );

    const [{ rows: loggedInUser }, { rows: savedTitleSlug }] =
      await Promise.all([checkUser, checkTitleSlug]);

    if (loggedInUser.length === 0) {
      await deleteSession(db, req, res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedError("Unable to create post");
    }

    const [{ authorName, authorImage, isRegistered }] = loggedInUser;

    if (!isRegistered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new RegistrationError("Unable to create post");
    }

    if (savedTitleSlug.length > 0) {
      const [{ slug: savedSlug, title: savedTitle }] = savedTitleSlug;

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

    const { rows: savedPost } = await db.query<PostDBData>(
      `WITH post_tag_ids AS (
        SELECT NULLIF(
          ARRAY(
            SELECT id
            FROM post_tags
            WHERE tag_id = ANY ($8::uuid[])
          ),
          '{}'
        ) AS tag_ids
      ),
      created_post AS (
        INSERT INTO posts (
          title,
          description,
          excerpt,
          content,
          slug,
          author,
          status,
          image_banner,
          date_published,
          tags
        )
        VALUES ($1, $2, $3, $4, $5, $6, 'Published', $7, CURRENT_TIMESTAMP(3), (SELECT tag_ids FROM post_tag_ids))
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
        cp.post_id id,
        cp.date_created "dateCreated",
        cp.date_published "datePublished",
        cp.last_modified "lastModified",
        cp.views,
        cp.is_in_bin "isInBin",
        cp.is_deleted "isDeleted",
        json_agg(json_build_object(
          'id', pt.tag_id,
          'name', pt.name,
          'dateCreated', pt.date_created,
          'lastModified', pt.last_modified
        )) FILTER (WHERE pt.tag_id IS NOT NULL) tags
      FROM created_post cp
      LEFT JOIN post_tags pt
      ON pt.id = ANY (cp.tags)
      GROUP BY
        cp.post_id,
        cp.date_created,
        cp.date_published,
        cp.last_modified,
        cp.views,
        cp.is_in_bin,
        cp.is_deleted`,
      [title, description, excerpt, content, slug, user, imageBanner, dbTags]
    );

    const [saved] = savedPost;

    return new SinglePost({
      id: saved.id,
      title,
      description,
      excerpt,
      content,
      author: { name: authorName, image: authorImage },
      status: "Published",
      url: { slug, href: slug },
      imageBanner,
      dateCreated: saved.dateCreated,
      datePublished: saved.datePublished,
      lastModified: saved.lastModified,
      views: saved.views,
      isInBin: saved.isInBin,
      isDeleted: saved.isDeleted,
      tags: saved.tags,
    });
  } catch (err) {
    if (post.imageBanner) supabaseEvent.emit("removeImage", post.imageBanner);

    if (err instanceof ValidationError) {
      return new PostValidationError(generateErrorsObject(err.details));
    }

    throw new GraphQLError("Unable to create post. Please try again later");
  }
};

export default createPost;
