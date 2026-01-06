import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { PostIdValidationError } from "@typeResolvers/posts/PostIdValidationError";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { postUUIDSchema as schema } from "@validators/posts/postUUID";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { BinPost, BinPostCTE } from "types/posts/binPost";
import type { GetPostDBData } from "types/posts";

const binPost: BinPost = async (_, { postId }, { res, db, user }) => {
  const MSG = "Unable to move post to bin";

  try {
    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const inputPostId = await schema.validateAsync(postId);

    const { rows } = await db.query<BinPostCTE>(
      `WITH find_user AS (
        SELECT is_registered FROM users WHERE user_id = $1
      ),
      find_post AS (
        SELECT
          json_build_object(
            'id', id,
            'binnedAt', binned_at
          ) post
        FROM posts
        WHERE post_id = $2
      )
      SELECT * FROM find_user LEFT JOIN find_post ON true`,
      [user, inputPostId]
    );

    if (rows.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const [{ is_registered, post }] = rows;

    if (!is_registered) return new ErrorResponse("RegistrationError", MSG);

    if (!post) return new ErrorResponse("NotFoundError", MSG);

    if (post.binnedAt) {
      const msg = "This blog post has already been sent to bin";
      return new ErrorResponse("ForbiddenError", msg);
    }

    const { rows: binnedPost } = await db.query<Omit<GetPostDBData, "postId">>(
      `WITH bin_post AS (
        UPDATE posts
        SET binned_at = CURRENT_TIMESTAMP(3)
        WHERE id = $1 AND binned_at IS NULL
        RETURNING *
      )
      SELECT
        bp.post_id id,
        bp.title,
        bp.description,
        bp.excerpt,
        pc.content,
        json_build_object(
          'image', u.image,
          'name', u.first_name||' '||u.last_name
        ) author,
        bp.status,
        json_build_object(
          'slug', bp.slug,
          'href', bp.slug
        ) url,
        bp.image_banner "imageBanner",
        bp.date_created "dateCreated",
        bp.date_published "datePublished",
        bp.last_modified "lastModified",
        bp.views,
        bp.binned_at "binnedAt",
        json_agg(
          json_build_object(
            'id', pt.tag_id,
            'name', pt.name,
            'dateCreated', pt.date_created,
            'lastModified', pt.last_modified
          )
        ) FILTER (WHERE pt.tag_id IS NOT NULL) tags
      FROM bin_post bp
      JOIN users u ON bp.author = u.id
      LEFT JOIN post_contents pc ON bp.id = pc.post_id
      LEFT JOIN post_tags_to_posts ptp ON bp.id = ptp.post_id
      LEFT JOIN post_tags pt ON ptp.tag_id = pt.id
      GROUP BY
        bp.post_id,
        bp.title,
        bp.description,
        bp.excerpt,
        pc.content,
        u.image,
        u.first_name,
        u.last_name,
        bp.status,
        bp.slug,
        bp.image_banner,
        bp.date_created,
        bp.date_published,
        bp.last_modified,
        bp.views,
        bp.binned_at`,
      [post.id]
    );

    const [binned] = binnedPost;

    return new SinglePost(binned);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdValidationError(err.message);
    }

    // log any system error that occur

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default binPost;
