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
import type { ResolverFunc, PostFieldResolver, PostDBData } from "@types";

type CreatePost = PostFieldResolver<
  ResolverFunc<MutationResolvers["createPost"]>
>;

interface User {
  userId: string;
  isRegistered: boolean;
  authorName: string;
  authorImage: string | null;
}

const createPost: CreatePost = async (_, { post }, { db, user, req, res }) => {
  const postImage = post.imageBanner && post.imageBanner.trim();

  try {
    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      void deleteSession(db, req, res);
      return new AuthenticationError("Unable to create post");
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
      void deleteSession(db, req, res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new NotAllowedError("Unable to create post");
    }

    const [{ userId, authorName, authorImage, isRegistered }] = loggedInUser;

    if (!isRegistered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new RegistrationError("Unable to create post");
    }

    const { rows: findPost } = await db.query<{ slug: string; title: string }>(
      `SELECT slug, title
      FROM posts
      WHERE slug = $1 OR lower(title) = $2`,
      [slug, title.toLowerCase()]
    );

    if (findPost.length > 0) {
      const [{ slug: savedSlug, title: savedTitle }] = findPost;

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
      `WITH create_post AS (
        INSERT INTO posts (title, description, excerpt, slug, author, image_banner, status, date_published)
        VALUES ($1, $2, $3, $4, $5, $6, 'Published', CURRENT_TIMESTAMP(3))
        RETURNING *
      ),
      resolved_tags AS (
        SELECT id, tag_id, name, date_created, last_modified
        FROM post_tags
        WHERE tag_id = ANY ($7::uuid[])
      ),
      insert_tags AS (
        INSERT INTO post_tags_to_posts (post_id, tag_id)
        SELECT cp.id, rt.id
        FROM create_post cp, resolved_tags rt
        WHERE EXISTS (SELECT 1 FROM resolved_tags)
      ),
      insert_content AS (
        INSERT INTO post_contents (post_id, content)
        SELECT id, $8::text
        FROM create_post
      )
      SELECT
        cp.post_id id,
        cp.slug,
        cp.title,
        cp.description,
        cp.excerpt,
        $8::text content,
        cp.status,
        cp.image_banner "imageBanner",
        cp.date_created "dateCreated",
        cp.date_published "datePublished",
        cp.last_modified "lastModified",
        cp.views,
        cp.is_in_bin "isInBin",
        cp.is_deleted "isDeleted",
        json_agg(
          json_build_object(
            'id', rt.tag_id,
            'name', rt.name,
            'dateCreated', rt.date_created,
            'lastModified', rt.last_modified
          )
        ) FILTER (WHERE rt.id IS NOT NULL) tags
      FROM create_post cp
      LEFT JOIN resolved_tags rt ON TRUE
      GROUP BY
        cp.post_id,
        cp.slug,
        cp.title,
        cp.description,
        cp.excerpt,
        $8::text,
        cp.status,
        cp.image_banner,
        cp.date_created,
        cp.date_published,
        cp.last_modified,
        cp.views,
        cp.is_in_bin,
        cp.is_deleted`,
      [title, description, excerpt, slug, userId, imageBanner, dbTags, content]
    );

    const [saved] = savedPost;

    return new SinglePost({
      id: saved.id,
      title: saved.title,
      description: saved.description,
      excerpt: saved.excerpt,
      content: saved.content,
      author: { name: authorName, image: authorImage },
      status: saved.status,
      url: { slug: saved.slug, href: saved.slug },
      imageBanner: saved.imageBanner,
      dateCreated: saved.dateCreated,
      datePublished: saved.datePublished,
      lastModified: saved.lastModified,
      views: saved.views,
      isInBin: saved.isInBin,
      isDeleted: saved.isDeleted,
      tags: saved.tags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new PostValidationError(generateErrorsObject(err.details));
    }

    throw new GraphQLError("Unable to create post. Please try again later");
  }
};

export default createPost;
