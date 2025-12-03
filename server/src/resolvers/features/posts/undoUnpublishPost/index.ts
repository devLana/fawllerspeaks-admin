import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import { PostIdValidationError } from "@typeResolvers/posts/PostIdValidationError";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { postUUIDSchema } from "@validators/posts/postUUID";
import deleteSession from "@utils/deleteSession";
import type { GetPostDBData, UnpublishUndo } from "types/posts";
import type { UndoUnpublishPost as Fn } from "types/posts/undoUnpublishPost";

const undoUnpublishPost: Fn = async (_, { postId }, { db, req, res, user }) => {
  const MSG = "Unable to undo unpublish post";

  try {
    if (!user) {
      void deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const post = await postUUIDSchema.validateAsync(postId);

    const { rows } = await db.query<UnpublishUndo>(
      `WITH find_user AS (
        SELECT is_registered FROM users WHERE user_id = $1
      ),
      find_post AS (
        SELECT status, is_in_bin FROM posts WHERE post_id = $2
      )
      SELECT *
      FROM find_user
      LEFT JOIN find_post ON true`,
      [user, post]
    );

    if (rows.length === 0) {
      void deleteSession(db, req, res);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    const [{ is_registered, status, is_in_bin }] = rows;

    if (!is_registered) return new ErrorResponse("RegistrationError", MSG);

    if (!status) return new ErrorResponse("UnknownError", MSG);

    if (is_in_bin) {
      const msg = "This blog post cannot be undone back to Published";
      return new ErrorResponse("NotAllowedPostActionError", msg);
    }

    if (status === "Draft") {
      const msg = "Only an Unpublished post can be undone back to Published";
      return new ErrorResponse("NotAllowedPostActionError", msg);
    }

    if (status === "Published") {
      return new Response("This blog post is already a Published post", "WARN");
    }

    const { rows: updatePost } = await db.query<Omit<GetPostDBData, "postId">>(
      `WITH update_status AS (
        UPDATE posts
        SET
          status = 'Published',
          date_published = CURRENT_TIMESTAMP(3),
          last_modified = CURRENT_TIMESTAMP(3)
        WHERE post_id = $1
        RETURNING id, status, date_published, last_modified
      )
      SELECT
        p.post_id id,
        p.title,
        p.description,
        p.excerpt,
        pc.content,
        json_build_object(
          'image', u.image,
          'name', u.first_name||' '||u.last_name
        ) author,
        us.status,
        json_build_object(
          'slug', p.slug,
          'href', p.slug
        ) url,
        p.image_banner "imageBanner",
        p.date_created "dateCreated",
        us.date_published "datePublished",
        us.last_modified "lastModified",
        p.views,
        p.is_in_bin "isBinned",
        p.binned_at "binnedAt",
        json_agg(
          json_build_object(
            'id', pt.tag_id,
            'name', pt.name,
            'dateCreated', pt.date_created,
            'lastModified', pt.last_modified
          )
        ) FILTER (WHERE pt.id IS NOT NULL) tags
      FROM posts p
      JOIN users u ON p.author = u.id
      LEFT JOIN update_status us ON p.id = us.id
      LEFT JOIN post_contents pc ON p.id = pc.post_id
      LEFT JOIN post_tags_to_posts ptp ON p.id = ptp.post_id
      LEFT JOIN post_tags pt ON ptp.tag_id = pt.id
      WHERE p.post_id = $1
      GROUP BY
        p.post_id,
        p.title,
        p.description,
        p.excerpt,
        pc.content,
        u.image,
        u.first_name,
        u.last_name,
        us.status,
        p.slug,
        p.image_banner,
        p.date_created,
        us.date_published,
        us.last_modified,
        p.views,
        p.is_in_bin,
        p.binned_at`,
      [post]
    );

    const [updated] = updatePost;

    return new SinglePost(updated);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdValidationError(err.message);
    }

    // log any system errors

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default undoUnpublishPost;
