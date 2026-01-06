import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { Posts } from "@typeResolvers/posts/Posts";
import { PostIdsValidationError } from "@typeResolvers/posts/PostIdsValidationError";
import { PostsWarning } from "@typeResolvers/posts/PostsWarning";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { binPostsValidator as schema } from "@validators/posts/binPosts";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { GetPostDBData } from "types/posts";
import type { BinPosts } from "types/posts/binPosts";

const binPosts: BinPosts = async (_, { postIds }, { res, db, user }) => {
  const MSG = `Unable to move ${postIds.length > 1 ? "posts" : "post"} to bin`;

  try {
    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const ids = await schema.validateAsync(postIds, { abortEarly: false });

    const { rows: foundUser } = await db.query<{ is_registered: boolean }>(
      `SELECT is_registered FROM users WHERE user_id = $1`,
      [user]
    );

    if (foundUser.length === 0) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    if (!foundUser[0].is_registered) {
      return new ErrorResponse("RegistrationError", MSG);
    }

    const { rows: binnedPosts } = await db.query<Omit<GetPostDBData, "postId">>(
      `WITH bin_posts AS (
        UPDATE posts SET
          binned_at = CURRENT_TIMESTAMP(3)
        WHERE post_id = ANY ($1) AND binned_at IS NULL
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
      FROM bin_posts bp
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
      [ids]
    );

    if (binnedPosts.length === 0) {
      const msg =
        ids.length === 1
          ? "The selected post could not be moved to bin"
          : "None of the selected posts could be moved to bin";

      return new ErrorResponse("NotFoundError", msg);
    }

    if (binnedPosts.length < ids.length) {
      const message = `${binnedPosts.length} out of ${ids.length} posts moved to bin`;
      return new PostsWarning(binnedPosts, message);
    }

    return new Posts(binnedPosts);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new PostIdsValidationError(err.message);
    }

    // log any system errors

    throw new GraphQLError(`${MSG}. Please try again later`);
  }
};

export default binPosts;
