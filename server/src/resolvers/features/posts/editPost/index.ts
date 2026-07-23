import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { EditPostValidationError } from "@typeResolvers/posts/EditPostValidationError";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { editPostValidator as schema } from "@validators/posts/editPost";
import { supabaseEvent } from "@events/supabase";
import { generateErrorsObject } from "@utils/generateErrorsObject";
import { clearAuthCookie } from "@utils/auth/cookies";
import { findRows, editContent, editTags } from "@utils/posts/editPost";
import type { Edit, SqlValues } from "@appTypes/posts/editPost";
import type { PostTag } from "@appTypes/resolverTypes";
import type { Draft_Edit } from "@appTypes/posts";

const editPost: Edit = async (_, { post }, { user, db, res }) => {
  const postImage = post.imageBanner?.trim();

  try {
    const MSG = "Unable to edit post";

    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const postInput = await schema.validateAsync(post, { abortEarly: false });
    const { id, title, description, excerpt, content, tagIds } = postInput;
    const { imageBanner, editStatus } = postInput;

    const rows = await findRows(db, user, id);

    if (rows.length === 0) {
      clearAuthCookie(res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const [{ is_registered, userName, userImage }] = rows;

    if (!is_registered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("RegistrationError", MSG);
    }

    const [{ id: postId, image_banner, binned_at }] = rows;
    let [{ status }] = rows;

    if (postId === null) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("NotFoundError", MSG);
    }

    if (binned_at) {
      const msg = "This blog post cannot be edited";
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("ForbiddenError", msg);
    }

    const updateValues: SqlValues = [postId, title];
    let updateFields = `title = $2, last_modified = CURRENT_TIMESTAMP(3)`;
    let index = 2;

    if (editStatus) {
      status = status === "Published" ? "Unpublished" : "Published";
    }

    if (status !== "Draft") {
      if (!description || !excerpt || !content) {
        if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);

        return new EditPostValidationError({
          ...(!content && { contentError: "Provide post content" }),
          ...(!description && { descriptionError: "Provide post description" }),
          ...(!excerpt && { excerptError: "Provide post excerpt" }),
        });
      }

      updateValues.push(description, excerpt);
      updateFields = `${updateFields}, description = $${String(++index)}, excerpt = $${String(++index)}`;

      if (imageBanner || imageBanner === null) {
        updateValues.push(imageBanner);
        updateFields = `${updateFields}, image_banner = $${String(++index)}`;
      }

      if (editStatus) {
        if (status === "Unpublished") {
          updateFields = `${updateFields}, status = 'Unpublished', date_published = NULL`;
        } else {
          updateFields = `${updateFields}, status = 'Published', date_published = CURRENT_TIMESTAMP(3)`;
        }
      }
    } else {
      if (description || description === null) {
        updateValues.push(description);
        updateFields = `${updateFields}, description = $${String(++index)}`;
      }

      if (excerpt || excerpt === null) {
        updateValues.push(excerpt);
        updateFields = `${updateFields}, excerpt = $${String(++index)}`;
      }

      if (imageBanner || imageBanner === null) {
        updateValues.push(imageBanner);
        updateFields = `${updateFields}, image_banner = $${String(++index)}`;
      }
    }

    await db.query("BEGIN");

    const { rows: updatedPost } = await db.query<Omit<Draft_Edit, "id">>(
      `UPDATE posts
      SET ${updateFields}
      WHERE id = $1
      RETURNING
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
      updateValues
    );

    let postTags: PostTag[] | null = null;

    if (tagIds !== undefined) {
      postTags = await editTags(db, tagIds, postId);
    }

    let postContent: string | null = null;

    if (content !== undefined) {
      postContent = await editContent(db, content, postId);
    }

    if (imageBanner !== undefined && image_banner) {
      supabaseEvent.emit("removeImage", image_banner);
    }

    await db.query("COMMIT");

    const [updated] = updatedPost;

    return new SinglePost({
      id: updated.post_id,
      title: updated.title,
      description: updated.description,
      excerpt: updated.excerpt,
      content: postContent,
      author: { name: userName, image: userImage },
      status: updated.status,
      url: { slug: updated.slug, href: updated.slug },
      imageBanner: updated.image_banner,
      dateCreated: updated.date_created,
      datePublished: updated.date_published,
      lastModified: updated.last_modified,
      views: updated.views,
      binnedAt: updated.binned_at,
      tags: postTags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new EditPostValidationError(generateErrorsObject(err.details));
    }

    await db.query("ROLLBACK");

    // log any system errors

    throw new GraphQLError("Unable to edit post. Please try again later");
  }
};

export default editPost;
