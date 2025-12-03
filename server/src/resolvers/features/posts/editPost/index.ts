import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { EditPostValidationError } from "@typeResolvers/posts/EditPostValidationError";
import { SinglePost } from "@typeResolvers/posts/SinglePost";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { editPostValidator as schema } from "@validators/posts/editPost";
import { supabaseEvent } from "@events/supabase";
import generateErrorsObject from "@utils/generateErrorsObject";
import getPostSlug from "@utils/posts/getPostSlug";
import deleteSession from "@utils/deleteSession";
import type { Edit, EditPostCTE } from "types/posts/editPost";
import type { PostDBData } from "types/posts";

const editPost: Edit = async (_, { post }, { user, db, req, res }) => {
  const postImage = post.imageBanner && post.imageBanner.trim();

  try {
    const MSG = "Unable to edit post";

    if (!user) {
      if (postImage) supabaseEvent.emit("removeImage", postImage);
      void deleteSession(db, req, res);
      return new ErrorResponse("AuthenticationError", MSG);
    }

    const postInput = await schema.validateAsync(post, { abortEarly: false });
    const { id, title, description, excerpt, content, tagIds } = postInput;
    const { imageBanner, editStatus } = postInput;
    const slug = getPostSlug(title);

    const { rows } = await db.query<EditPostCTE>(
      `WITH find_user AS (
        SELECT
          is_registered,
          first_name||' '||last_name "userName",
          image "userImage"
        FROM users
        WHERE user_id = $1
      ),
      find_post_by_id AS (
        SELECT
          status,
          image_banner,
          is_in_bin
        FROM posts
        WHERE post_id = $2
      )
      SELECT *
      FROM find_user
      LEFT JOIN find_post_by_id ON true`,
      [user, id]
    );

    if (rows.length === 0) {
      void deleteSession(db, req, res);
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("NotAllowedError", MSG);
    }

    const [{ is_registered, userName, userImage }] = rows;

    if (!is_registered) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("RegistrationError", MSG);
    }

    const [{ image_banner, is_in_bin }] = rows;
    let [{ status }] = rows;

    if (!status) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("UnknownError", MSG);
    }

    if (is_in_bin) {
      const msg = "This blog post cannot be edited";
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);
      return new ErrorResponse("NotAllowedPostActionError", msg);
    }

    let datePublished = "";

    if (editStatus) {
      if (status === "Draft" || status === "Unpublished") {
        status = "Published";
        datePublished = ",date_published = CURRENT_TIMESTAMP(3)";
      } else {
        status = "Unpublished";
        datePublished = ",date_published = NULL";
      }
    }

    if (status !== "Draft" && (!description || !excerpt || !content)) {
      if (imageBanner) supabaseEvent.emit("removeImage", imageBanner);

      return new EditPostValidationError({
        ...(!content && { contentError: "Provide post content" }),
        ...(!description && { descriptionError: "Provide post description" }),
        ...(!excerpt && { excerptError: "Provide post excerpt" }),
      });
    }

    const image = imageBanner === undefined ? image_banner : imageBanner;
    const tags = tagIds ? `{${tagIds.join(",")}}` : tagIds;

    const { rows: editedPost } = await db.query<PostDBData>(
      `WITH edit_post AS (
        UPDATE posts SET
          title = $1,
          description = $2,
          excerpt = $3,
          slug = $4,
          status = $5,
          image_banner = $6,
          last_modified = CURRENT_TIMESTAMP(3)
          ${datePublished}
        WHERE post_id = $7
        RETURNING *
      ),
      resolved_tags AS (
        SELECT id, tag_id, name, date_created, last_modified
        FROM post_tags         
        WHERE tag_id = ANY ($8::uuid[])
      ),
      tags_to_insert AS (
        SELECT rt.id
        FROM resolved_tags rt LEFT JOIN post_tags_to_posts ptp
        ON rt.id = ptp.tag_id AND ptp.post_id = (SELECT id FROM edit_post)
        WHERE ptp.tag_id IS NULL
      ),
      insert_tags AS (
        INSERT INTO post_tags_to_posts (post_id, tag_id)
        SELECT ep.id, ti.id
        FROM edit_post ep CROSS JOIN tags_to_insert ti
      ),
      tags_to_delete AS (
        SELECT ptp.tag_id
        FROM resolved_tags rt RIGHT JOIN post_tags_to_posts ptp
        ON ptp.tag_id = rt.id AND ptp.post_id = (SELECT id FROM edit_post)
        WHERE rt.id IS NULL AND EXISTS (SELECT 1 FROM resolved_tags)
      ),
      delete_tags AS (
        DELETE FROM post_tags_to_posts
        WHERE post_id = (SELECT id FROM edit_post)
        AND tag_id IN (SELECT tag_id FROM tags_to_delete)
      ),
      delete_content AS (
        DELETE FROM post_contents
        WHERE post_id = (SELECT id FROM edit_post)
        AND $9::text IS NULL
      ),
      insert_or_upsert_content AS (
        INSERT INTO post_contents (post_id, content)
        SELECT id, $9::text
        FROM edit_post
        WHERE $9::text IS NOT NULL
        ON CONFLICT (post_id)
        DO UPDATE SET content = EXCLUDED.content
      )
      SELECT
        ep.post_id id,
        ep.slug,
        ep.title,
        ep.description,
        ep.excerpt,
        $9::text content,
        ep.image_banner "imageBanner",
        ep.status,
        ep.date_created "dateCreated",
        ep.date_published "datePublished",
        ep.last_modified "lastModified",
        ep.views,
        ep.is_in_bin "isBinned",
        ep.binned_at "binnedAt",
        json_agg(
          json_build_object(
            'id', rt.tag_id,
            'name', rt.name,
            'dateCreated', rt.date_created,
            'lastModified', rt.last_modified
          )
        ) FILTER (WHERE rt.id IS NOT NULL) tags
      FROM edit_post ep
      LEFT JOIN resolved_tags rt ON TRUE
      GROUP BY
        ep.post_id,
        ep.slug,
        ep.title,
        ep.description,
        ep.excerpt,
        $9::text,
        ep.image_banner,
        ep.status,
        ep.date_created,
        ep.date_published,
        ep.last_modified,
        ep.views,
        ep.is_in_bin,
        ep.binned_at`,
      [title, description, excerpt, slug, status, image, id, tags, content]
    );

    if (imageBanner !== undefined && image_banner) {
      supabaseEvent.emit("removeImage", image_banner);
    }

    const [edited] = editedPost;

    return new SinglePost({
      id: edited.id,
      title: edited.title,
      description: edited.description,
      excerpt: edited.excerpt,
      content: edited.content,
      author: { name: userName, image: userImage },
      status,
      url: { slug: edited.slug, href: edited.slug },
      imageBanner: edited.imageBanner,
      dateCreated: edited.dateCreated,
      datePublished: edited.datePublished,
      lastModified: edited.lastModified,
      views: edited.views,
      isBinned: edited.isBinned,
      binnedAt: edited.binnedAt,
      tags: edited.tags,
    });
  } catch (err) {
    if (postImage) supabaseEvent.emit("removeImage", postImage);

    if (err instanceof ValidationError) {
      return new EditPostValidationError(generateErrorsObject(err.details));
    }

    // log any system errors

    throw new GraphQLError("Unable to edit post. Please try again later");
  }
};

export default editPost;
