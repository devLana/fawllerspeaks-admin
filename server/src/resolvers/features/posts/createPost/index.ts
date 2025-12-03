import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@events/supabase";
import { createPostValidator as schema } from "@validators/posts/createPost";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { PostValidationError } from "@typeResolvers/posts/PostValidationError";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";
import getPostSlug from "@utils/posts/getPostSlug";
import generateUniqueSlug from "@utils/posts/generateUniqueSlug";
import type { CreatePost } from "types/posts/createPost";
import type { CreateDraftUser, PostDBData } from "types/posts";

const createPost: CreatePost = async (_, { post }, { db, user, req, res }) => {
  const postImage = post.imageBanner && post.imageBanner.trim();

  try {
    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      void deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", "Unable to create post");
    }

    const input = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, excerpt, content, tagIds, imageBanner } = input;
    let slug = getPostSlug(title);

    const { rows } = await db.query<CreateDraftUser>(
      `WITH find_user AS (
        SELECT
          id,
          is_registered,
          concat(first_name,' ',last_name) "authorName",
          image
        FROM users
        WHERE user_id = $1
      ),
      find_post AS (
        SELECT 1 as slug
        FROM posts
        WHERE slug = $2
      )
      SELECT *
      FROM find_user
      LEFT JOIN find_post ON true`,
      [user, slug]
    );

    if (rows.length === 0) {
      void deleteSession(db, req, res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("NotAllowedError", "Unable to create post");
    }

    const [{ id, authorName, image, is_registered }] = rows;

    if (!is_registered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("RegistrationError", "Unable to create post");
    }

    if (rows[0].slug) {
      slug = await generateUniqueSlug(slug);
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
        cp.is_in_bin "isBinned",
        cp.binned_at "binnedAt",
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
        cp.binned_at`,
      [title, description, excerpt, slug, id, imageBanner, dbTags, content]
    );

    const [saved] = savedPost;

    return new SinglePost({
      id: saved.id,
      title: saved.title,
      description: saved.description,
      excerpt: saved.excerpt,
      content: saved.content,
      author: { name: authorName, image },
      status: saved.status,
      url: { slug: saved.slug, href: saved.slug },
      imageBanner: saved.imageBanner,
      dateCreated: saved.dateCreated,
      datePublished: saved.datePublished,
      lastModified: saved.lastModified,
      views: saved.views,
      isBinned: saved.isBinned,
      binnedAt: saved.binnedAt,
      tags: saved.tags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new PostValidationError(generateErrorsObject(err.details));
    }

    // log any system errors

    throw new GraphQLError("Unable to create post. Please try again later");
  }
};

export default createPost;
