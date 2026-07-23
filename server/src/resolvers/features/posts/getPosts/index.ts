import { Buffer } from "node:buffer";

import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { GetPostsValidationError } from "@typeResolvers/posts/GetPostsValidationError";
import { GetPostsData } from "@typeResolvers/posts/GetPostsData";
import { ErrorResponse } from "@typeResolvers/commonResolvers";
import { getPostsSchema as schema } from "@validators/posts/getPosts";
import { clearAuthCookie } from "@utils/auth/cookies";
import { generateErrorsObject } from "@utils/generateErrorsObject";
import type { GetPostDBData } from "@appTypes/posts";
import type { GetPosts, PreviousPost, Sort } from "@appTypes/posts/getPosts";

const getPosts: GetPosts = async (_, args, { db, user, res }) => {
  try {
    const MSG = "Unable to retrieve posts";

    if (!user) {
      clearAuthCookie(res);
      return new ErrorResponse("UnauthorizedError", MSG);
    }

    const input = await schema.validateAsync(args, { abortEarly: false });

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

    /* Set up to fetch posts from DB based on the provided params */
    const { after, size, sort: sortFilter, status } = input;
    const LIMIT = size ?? 12;
    const sort: Sort = { column: "p.date_created", order: "DESC" };
    const sqlArgs: Array<string | number> = [];
    let where = "WHERE binned_at IS NULL";
    let orderBy = "p.date_created DESC, p.id DESC";
    let operator: "<" | ">" = "<";
    let count = 0;

    if (sortFilter) {
      const [column, order] = sortFilter.split("_");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      sort.order = order.toUpperCase() as Sort["order"];
      operator = sort.order === "DESC" ? "<" : ">";

      if (column === "title") {
        orderBy = `p.title ${sort.order}`;
        sort.column = "p.title";
      } else {
        orderBy = `p.date_created ${sort.order}, p.id ${sort.order}`;
        sort.column = "p.date_created";
      }
    }

    if (after) {
      const cursor = Buffer.from(after, "base64url").toString();
      const { column } = sort;

      if (column === "p.date_created") {
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z_\d+$/.test(cursor)) {
          return new ErrorResponse("ForbiddenError", MSG);
        }

        where = `${where} AND ${column} ${operator}= $${String(++count)} AND p.id ${operator} $${String(++count)}`;
        sqlArgs.push(...cursor.split("_"));
      } else {
        where = `${where} AND ${column} ${operator} $${String(++count)}`;
        sqlArgs.push(cursor);
      }
    }

    if (status) {
      where = `${where} AND p.status = $${String(++count)}`;
      sqlArgs.push(status);
    }

    const { rows: savedPosts } = await db.query<GetPostDBData>(
      `SELECT
        p.id "postId",
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
      ${where}
      GROUP BY
        p.id,
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
        p.binned_at
      ORDER BY ${orderBy}
      LIMIT ${String(LIMIT + 1)}`,
      sqlArgs
    );

    const pageData: { next?: string | null; previous?: string | null } = {};

    /* set next page cursor */
    if (savedPosts.length > LIMIT) {
      savedPosts.pop();

      const { dateCreated, title, postId } = savedPosts[LIMIT - 1];

      if (sort.column === "p.date_created") {
        const dateString = new Date(dateCreated).toISOString();
        const dateId = `${dateString}_${postId.toString()}`;
        pageData.next = Buffer.from(dateId).toString("base64url");
      } else {
        pageData.next = Buffer.from(title).toString("base64url");
      }
    }

    /* set up previous page cursor if posts were fetched for the next page using the after cursor */
    if (after && savedPosts.length > 0) {
      const { column, order } = sort;
      const cursor = Buffer.from(after, "base64url").toString();
      const prevOperator = operator === ">" ? "<=" : ">=";
      const prevArgs: Array<number | string> = [];
      const prevOrder = order === "DESC" ? "ASC" : "DESC";
      let prevWhere = "WHERE binned_at IS NULL";
      let prevOrderBy: string;
      let prevCount = 0;

      if (column === "p.title") {
        prevOrderBy = `p.title ${prevOrder}`;
        prevWhere = `${prevWhere} AND ${column} ${prevOperator} $${String(++prevCount)}`;
        prevArgs.push(cursor);
      } else {
        prevOrderBy = `p.date_created ${prevOrder}, p.id ${prevOrder}`;
        prevWhere = `${prevWhere} AND ${column} ${prevOperator} $${String(++prevCount)} AND p.id ${prevOperator} $${String(++prevCount)}`;
        prevArgs.push(...cursor.split("_"));
      }

      if (status) {
        prevWhere = `${prevWhere} AND status = $${String(++prevCount)}`;
        prevArgs.push(status);
      }

      const { rows: foundPrevious } = await db.query<PreviousPost>(
        `SELECT id, title, date_created
        FROM posts p
        ${prevWhere}
        ORDER BY ${prevOrderBy}
        LIMIT ${String(LIMIT + 1)}`,
        prevArgs
      );

      if (foundPrevious.length < LIMIT + 1) {
        pageData.previous = "";
      } else {
        const { id, date_created, title } = foundPrevious[LIMIT];

        if (sort.column === "p.date_created") {
          const dateString = new Date(date_created).toISOString();
          const dateId = `${dateString}_${id.toString()}`;
          const cursorStr = Buffer.from(dateId).toString("base64url");
          pageData.previous = cursorStr;
        } else {
          const cursorStr = Buffer.from(title).toString("base64url");
          pageData.previous = cursorStr;
        }
      }
    }

    return new GetPostsData(savedPosts, pageData);
  } catch (err) {
    if (err instanceof ValidationError) {
      return new GetPostsValidationError(generateErrorsObject(err.details));
    }

    // log any system errors

    throw new GraphQLError("Unable to retrieve posts. Please try again later");
  }
};

export default getPosts;
