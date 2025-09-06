import { Buffer } from "node:buffer";

import { GraphQLError } from "graphql";
import { ValidationError } from "joi";

import { GetPostsValidationError } from "./types/GetPostsValidationError";
import { GetPostsData } from "./types/GetPostsData";
import {
  AuthenticationError,
  ForbiddenError,
  NotAllowedError,
  RegistrationError,
} from "@utils/ObjectTypes";

import { getPostsSchema as schema } from "./utils/getPosts.validator";
import deleteSession from "@utils/deleteSession";
import generateErrorsObject from "@utils/generateErrorsObject";

import type { QueryResolvers } from "@resolverTypes";
import type { GetPostDBData, PostFieldResolver, ResolverFunc } from "@types";

type GetPosts = PostFieldResolver<ResolverFunc<QueryResolvers["getPosts"]>>;

interface PreviousPost {
  id: number;
  title: string;
  date_created: string;
}

interface Sort {
  column: "p.date_created" | "p.title";
  order: "ASC" | "DESC";
}

const getPosts: GetPosts = async (_, args, { db, user, req, res }) => {
  try {
    if (!user) {
      await deleteSession(db, req, res);
      return new AuthenticationError("Unable to retrieve posts");
    }

    const input = await schema.validateAsync(args, { abortEarly: false });

    const { rows: foundUser } = await db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    if (foundUser.length === 0) {
      await deleteSession(db, req, res);
      return new NotAllowedError("Unable to retrieve posts");
    }

    if (!foundUser[0].isRegistered) {
      return new RegistrationError("Unable to retrieve posts");
    }

    const { after, size, sort: sortFilter, status } = input;
    const LIMIT = size ?? 12;
    const sort: Sort = { column: "p.date_created", order: "DESC" };
    const sqlArgs: (string | number)[] = [];
    let where = "WHERE is_in_bin = FALSE";
    let orderBy = "p.date_created DESC, p.id DESC";
    let operator: "<" | ">" = "<";
    let count = 0;

    if (sortFilter) {
      const [column, order] = sortFilter.split("_");
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
          return new ForbiddenError("Unable to retrieve posts");
        }

        where = `${where} AND ${column} ${operator}= $${++count} AND p.id ${operator} $${++count}`;
        sqlArgs.push(...cursor.split("_"));
      } else {
        where = `${where} AND ${column} ${operator} $${++count}`;
        sqlArgs.push(cursor);
      }
    }

    if (status) {
      where = `${where} AND p.status = $${++count}`;
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
        p.is_in_bin,
        p.binned_at
      ORDER BY ${orderBy}
      LIMIT ${LIMIT + 1}`,
      sqlArgs
    );

    const pageData: { next?: string | null; previous?: string | null } = {};

    if (savedPosts.length > LIMIT) {
      savedPosts.pop();

      const { dateCreated, title, postId } = savedPosts[LIMIT - 1];

      if (sort.column === "p.date_created") {
        const dateString = new Date(dateCreated).toISOString();
        const dateId = `${dateString}_${postId}`;
        pageData.next = Buffer.from(dateId).toString("base64url");
      } else {
        pageData.next = Buffer.from(title).toString("base64url");
      }
    }

    if (after && savedPosts.length > 0) {
      const { column, order } = sort;
      const cursor = Buffer.from(after, "base64url").toString();
      const prevOperator = operator === ">" ? "<=" : ">=";
      const prevArgs: (number | string)[] = [];
      const prevOrder = order === "DESC" ? "ASC" : "DESC";
      let prevWhere = "WHERE is_in_bin = FALSE";
      let prevOrderBy: string;
      let prevCount = 0;

      if (column === "p.title") {
        prevOrderBy = `p.title ${prevOrder}`;
        prevWhere = `${prevWhere} AND ${column} ${prevOperator} $${++prevCount}`;
        prevArgs.push(cursor);
      } else {
        prevOrderBy = `p.date_created ${prevOrder}, p.id ${prevOrder}`;
        prevWhere = `${prevWhere} AND ${column} ${prevOperator} $${++prevCount} AND p.id ${prevOperator} $${++prevCount}`;
        prevArgs.push(...cursor.split("_"));
      }

      if (status) {
        prevWhere = `${prevWhere} AND status = $${++prevCount}`;
        prevArgs.push(status);
      }

      const { rows: foundPrevious } = await db.query<PreviousPost>(
        `SELECT id, title, date_created
        FROM posts p
        ${prevWhere}
        ORDER BY ${prevOrderBy}
        LIMIT ${LIMIT + 1}`,
        prevArgs
      );

      if (foundPrevious.length < LIMIT + 1) {
        pageData.previous = "";
      } else {
        const { id, date_created, title } = foundPrevious[LIMIT];

        if (sort.column === "p.date_created") {
          const dateString = new Date(date_created).toISOString();
          const dateId = `${dateString}_${id}`;
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

    throw new GraphQLError("Unable to retrieve posts. Please try again later");
  }
};

export default getPosts;
