import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { ErrorResponse, Response } from "@typeResolvers/commonResolvers";
import { PostIdValidationError } from "@typeResolvers/posts/PostIdValidationError";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { postUUIDSchema } from "@validators/posts/postUUID";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { GetPostDBData, UnpublishUndo } from "types/posts";
import type { UnpublishPost as Fn } from "types/posts/unpublishPost";

const unpublishPost: Fn = async (_, { postId }, { db, res, user }) => {
  try {
    const MSG = "Unable to unpublish post";

    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const post = await postUUIDSchema.validateAsync(postId);

    const { rows } = await db.query<UnpublishUndo>(
      `WITH find_user AS (
        SELECT is_registered FROM users WHERE user_id = $1
      ),
      find_post AS (
        SELECT status, binned_at FROM posts WHERE post_id = $2
      )
      SELECT *
      FROM find_user
      LEFT JOIN find_post ON true`,
      [user, post]
    );

    if (rows.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const [{ is_registered, status, binned_at }] = rows;

    if (!is_registered) return new ErrorResponse("RegistrationError", MSG);

    if (!status) return new ErrorResponse("NotFoundError", MSG);

    if (binned_at) {
      const msg = "This blog post cannot be unpublished";
      return new ErrorResponse("ForbiddenError", msg);
    }

    if (status === "Draft") {
      const msg = "A Draft post cannot be unpublished";
      return new ErrorResponse("ForbiddenError", msg);
    }

    if (status === "Unpublished") {
      return new Response("This blog post is already Unpublished", "WARN");
    }

    const { rows: updatePost } = await db.query<Omit<GetPostDBData, "postId">>(
      `WITH update_status AS (
        UPDATE posts
        SET
          status = 'Unpublished',
          date_published = NULL,
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

    throw new GraphQLError("Unable to unpublish post. Please try again later");
  }
};

export default unpublishPost;
