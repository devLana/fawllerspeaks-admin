import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { GetPostValidationError } from "@typeResolvers/posts/GetPostValidationError";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { getPostSchema } from "@validators/posts/getPost";
import { clearAuthCookie } from "@utils/auth/cookies";
import type { GetPostDBData } from "types/posts";
import type { GetPost } from "types/posts/getPost";

const getPost: GetPost = async (_, { slug }, { user, db, res }) => {
  try {
    const MSG = "Unable to retrieve post";

    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const postSlug = await getPostSchema.validateAsync(slug);

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

    const { rows: foundPost } = await db.query<Omit<GetPostDBData, "postId">>(
      `SELECT
        p.post_id id,
        p.title,
        p.description,
        p.excerpt,
        pc.content,
        json_build_object(
          'image', u.image,
          'name', u.first_name||' '||u.last_name
        ) author,
        p.status,
        json_build_object(
          'href', p.slug,
          'slug', p.slug
        ) url,
        p.image_banner "imageBanner",
        p.date_created "dateCreated",
        p.date_published "datePublished",
        p.last_modified "lastModified",
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
      FROM posts p JOIN users u ON p.author = u.id
      LEFT JOIN post_contents pc ON p.id = pc.post_id
      LEFT JOIN post_tags_to_posts ptp ON p.id = ptp.post_id
      LEFT JOIN post_tags pt ON ptp.tag_id = pt.id
      WHERE p.slug = $1
      GROUP BY
        p.post_id,
        p.title,
        p.description,
        p.excerpt,
        pc.content,
        u.image,
        u.first_name,
        u.last_name,
        p.status,
        p.slug,
        p.image_banner,
        p.date_created,
        p.date_published,
        p.last_modified,
        p.views,
        p.binned_at`,
      [postSlug]
    );

    if (foundPost.length === 0) return new ErrorResponse("NotFoundError", MSG);

    return new SinglePost(foundPost[0]);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new GetPostValidationError(err.message);
    }

    // log any system errors

    throw new GraphQLError("Unable to retrieve post. Please try again later");
  }
};

export default getPost;
