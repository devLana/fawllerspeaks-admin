import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@events/supabase";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { PostValidationError } from "@typeResolvers/posts/PostValidationError";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { draftPostSchema as schema } from "@validators/posts/draftPost";
import generateErrorsObject from "@utils/generateErrorsObject";
import deleteSession from "@utils/deleteSession";
import getPostSlug from "@utils/posts/getPostSlug";
import generateUniqueSlug from "@utils/posts/generateUniqueSlug";
import type { DraftPost } from "types/posts/draftPost";
import type { CreateDraftUser, PostDBData } from "types/posts";

const draftPost: DraftPost = async (_, { post }, { db, user, req, res }) => {
  const postImage = post.imageBanner && post.imageBanner.trim();
  const MSG = "Unable to save post to draft";

  try {
    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      void deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", MSG);
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
      return new ErrorResponse("NotAllowedError", MSG);
    }

    const [{ id, image, authorName, is_registered }] = rows;

    if (!is_registered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("RegistrationError", MSG);
    }

    if (rows[0].slug) {
      slug = await generateUniqueSlug(slug);
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
        dp.is_in_bin "isBinned",
        dp.binned_at "binnedAt",
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
        dp.binned_at`,
      [title, description, excerpt, slug, id, imageBanner, dbTags, content]
    );

    const [drafted] = draftedPost;

    return new SinglePost({
      id: drafted.id,
      title: drafted.title,
      description: drafted.description,
      excerpt: drafted.excerpt,
      content: drafted.content,
      author: { name: authorName, image },
      status: "Draft",
      url: { slug: drafted.slug, href: drafted.slug },
      imageBanner: drafted.imageBanner,
      dateCreated: drafted.dateCreated,
      datePublished: drafted.datePublished,
      lastModified: drafted.lastModified,
      views: drafted.views,
      isBinned: drafted.isBinned,
      binnedAt: drafted.binnedAt,
      tags: drafted.tags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new PostValidationError(generateErrorsObject(err.details));
    }

    // log any system errors

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default draftPost;
