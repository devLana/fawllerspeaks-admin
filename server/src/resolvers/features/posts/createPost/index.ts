import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@events/supabase";
import { createPostValidator as schema } from "@validators/posts/createPost";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { PostValidationError } from "@typeResolvers/posts/PostValidationError";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { generateErrorsObject } from "@utils/generateErrorsObject";
import { clearAuthCookie } from "@utils/auth/cookies";
import { getPostSlug } from "@utils/posts/getPostSlug";
import { generateUniqueSlug } from "@utils/posts/generateUniqueSlug";
import { resolvePostTags, findRows } from "@utils/posts/create_draft";
import type { CreatePost, InsertedPost } from "@appTypes/posts/createPost";
import type { PostTag } from "@appTypes/resolverTypes";

const createPost: CreatePost = async (_, { post }, { db, user, res }) => {
  const postImage = post.imageBanner?.trim();

  try {
    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", "Unable to create post");
    }

    const input = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, excerpt, content, tagIds, imageBanner } = input;
    let slug = getPostSlug(title);

    const rows = await findRows(db, user, slug);

    if (rows.length === 0) {
      clearAuthCookie(res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("UnauthorizedError", "Unable to create post");
    }

    const [{ id, authorName, image, is_registered, slug: s }] = rows;

    if (!is_registered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("RegistrationError", "Unable to create post");
    }

    if (s === 1) {
      slug = await generateUniqueSlug(slug);
    }

    const insertValues = [title, description, excerpt, slug, id, content];
    let postInsertFields = `title, description, excerpt, slug, author, status, date_published`;
    let postInsertParams = `$1, $2, $3, $4, $5, 'Published', CURRENT_TIMESTAMP(3)`;

    if (imageBanner) {
      insertValues.push(imageBanner);
      postInsertFields = `${postInsertFields}, image_banner`;
      postInsertParams = `${postInsertParams}, $7`;
    }

    await db.query("BEGIN");

    const { rows: insertedPost } = await db.query<InsertedPost>(
      `WITH create_post AS (
        INSERT INTO posts (${postInsertFields})
        VALUES (${postInsertParams})
        RETURNING id, post_id, slug, title, description, excerpt, status, image_banner, date_created, date_published, last_modified, views, binned_at
      ),
      insert_content AS (
        INSERT INTO post_contents (post_id, content)
        SELECT id, $6::text
        FROM create_post
        RETURNING post_id, content
      )
      SELECT
        cp.id,
        cp.post_id,
        cp.slug,
        cp.title,
        cp.description,
        cp.excerpt,
        cp.status,
        cp.image_banner,
        cp.date_created,
        cp.date_published,
        cp.last_modified,
        cp.views,
        cp.binned_at,
        ic.content
      FROM create_post cp
      INNER JOIN insert_content ic ON cp.id = ic.post_id`,
      insertValues
    );

    const [{ id: postId, ...postInserted }] = insertedPost;
    let insertedPostTags: PostTag[] | null = null;

    if (tagIds) {
      insertedPostTags = await resolvePostTags(db, postId, tagIds);
    }

    await db.query("COMMIT");

    return new SinglePost({
      id: postInserted.post_id,
      title: postInserted.title,
      description: postInserted.description,
      excerpt: postInserted.excerpt,
      content: postInserted.content,
      author: { name: authorName, image },
      status: postInserted.status,
      url: { slug: postInserted.slug, href: postInserted.slug },
      imageBanner: postInserted.image_banner,
      dateCreated: postInserted.date_created,
      datePublished: postInserted.date_published,
      lastModified: postInserted.last_modified,
      views: postInserted.views,
      binnedAt: postInserted.binned_at,
      tags: insertedPostTags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new PostValidationError(generateErrorsObject(err.details));
    }

    await db.query("ROLLBACK");

    // log any system errors

    throw new GraphQLError("Unable to create post. Please try again later");
  }
};

export default createPost;
