import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { supabaseEvent } from "@events/supabase";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { PostValidationError } from "@typeResolvers/posts/PostValidationError";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { draftPostSchema as schema } from "@validators/posts/draftPost";
import generateErrorsObject from "@utils/generateErrorsObject";
import { clearAuthCookie } from "@utils/auth/cookies";
import getPostSlug from "@utils/posts/getPostSlug";
import generateUniqueSlug from "@utils/posts/generateUniqueSlug";
import { resolvePostTags, findRows } from "@utils/posts/create_draft";
import type { DraftPost } from "types/posts/draftPost";
import type { PostTag } from "@resolverTypes";
import type { Draft_Edit } from "types/posts";

const draftPost: DraftPost = async (_, { post }, { db, user, res }) => {
  const postImage = post.imageBanner && post.imageBanner.trim();
  const MSG = "Unable to save post to draft";

  try {
    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const input = await schema.validateAsync(post, { abortEarly: false });
    const { title, description, excerpt, content, tagIds, imageBanner } = input;
    let slug = getPostSlug(title);

    const rows = await findRows(db, user, slug);

    if (rows.length === 0) {
      clearAuthCookie(res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const [{ id, image, authorName, is_registered, slug: s }] = rows;

    if (!is_registered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("RegistrationError", MSG);
    }

    if (s === 1) {
      slug = await generateUniqueSlug(slug);
    }

    const insertValues = [slug, title, id];
    let postInsertFields = "slug, title, author, status";
    let postInsertParams = "$1, $2, $3, 'Draft'";
    let index = 3;

    if (description) {
      insertValues.push(description);
      postInsertFields = `${postInsertFields}, description`;
      postInsertParams = `${postInsertParams}, $${++index}`;
    }

    if (excerpt) {
      insertValues.push(excerpt);
      postInsertFields = `${postInsertFields}, excerpt`;
      postInsertParams = `${postInsertParams}, $${++index}`;
    }

    if (imageBanner) {
      insertValues.push(imageBanner);
      postInsertFields = `${postInsertFields}, image_banner`;
      postInsertParams = `${postInsertParams}, $${++index}`;
    }

    await db.query("BEGIN");

    const { rows: insertedPost } = await db.query<Draft_Edit>(
      `INSERT INTO posts (${postInsertFields})
        VALUES (${postInsertParams})
        RETURNING
          id,
          post_id,
          slug,
          title,
          description,
          excerpt,
          status,
          image_banner,
          date_created,
          date_published,
          last_modified,
          views,
          binned_at`,
      insertValues
    );

    const [{ id: postId, ...draftedPost }] = insertedPost;
    let insertedPostTags: PostTag[] | null = null;

    if (tagIds) {
      insertedPostTags = await resolvePostTags(db, postId, tagIds);
    }

    let postContent: string | null = null;

    if (content) {
      const { rows: insertedContent } = await db.query<{ content: string }>(
        `INSERT INTO post_contents (post_id, content)
        VALUES ($1, $2)
        RETURNING content`,
        [postId, content]
      );

      if (insertedContent.length > 0) {
        [{ content: postContent }] = insertedContent;
      }
    }

    await db.query("COMMIT");

    return new SinglePost({
      id: draftedPost.post_id,
      title: draftedPost.title,
      description: draftedPost.description,
      excerpt: draftedPost.excerpt,
      content: postContent,
      author: { name: authorName, image },
      status: "Draft",
      url: { slug: draftedPost.slug, href: draftedPost.slug },
      imageBanner: draftedPost.image_banner,
      dateCreated: draftedPost.date_created,
      datePublished: draftedPost.date_published,
      lastModified: draftedPost.last_modified,
      views: draftedPost.views,
      binnedAt: draftedPost.binned_at,
      tags: insertedPostTags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new PostValidationError(generateErrorsObject(err.details));
    }

    await db.query("ROLLBACK");

    // log any system errors

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default draftPost;
