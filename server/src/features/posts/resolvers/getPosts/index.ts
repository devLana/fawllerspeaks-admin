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

import type { QueryResolvers, GetPostsPageType } from "@resolverTypes";
import type { GetPostDBData, PostFieldResolver, ResolverFunc } from "@types";

type GetPosts = PostFieldResolver<ResolverFunc<QueryResolvers["getPosts"]>>;
type CursorDataTuple = [string, (number | string)[], string];

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

    const { filters, page } = input;
    const sqlArgs: (string | number)[] = [];
    const sort: Sort = { column: "p.date_created", order: "DESC" };
    let orderBy = "p.date_created DESC, p.id DESC";
    let where = "";
    let count = 0;

    if (filters?.sort) {
      const [column, order] = filters.sort.split("_");
      sort.order = order.toUpperCase() as Sort["order"];

      if (column === "title") {
        orderBy = `p.title ${sort.order}`;
        sort.column = "p.title";
      } else {
        orderBy = `p.date_created ${sort.order}, p.id ${sort.order}`;
        sort.column = "p.date_created";
      }
    }

    if (page) {
      const { cursor: cursorQueryStr, type } = page;
      const cursor = Buffer.from(cursorQueryStr, "base64url").toString();
      let operator: string;
      let { order } = sort;

      if (type === "before") {
        order = sort.order === "ASC" ? "DESC" : "ASC";
        operator = sort.order === "DESC" ? ">" : "<";
      } else {
        operator = sort.order === "DESC" ? "<" : ">";
      }

      if (sort.column === "p.date_created") {
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z_\d+$/.test(cursor)) {
          return new ForbiddenError("Unable to retrieve posts");
        }

        orderBy = `p.date_created ${order}, p.id ${order}`;
        where = ` WHERE p.date_created ${operator}= $${++count} AND p.id ${operator} $${++count}`;
        sqlArgs.push(...cursor.split("_"));
      } else {
        orderBy = `title ${order}`;
        where = ` WHERE p.title ${operator} $${++count}`;
        sqlArgs.push(cursor);
      }
    }

    if (filters?.status) {
      where = where
        ? `${where} AND p.status = $${++count}`
        : ` WHERE p.status = $${++count}`;

      sqlArgs.push(filters.status);
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
        p.is_in_bin "isInBin",
        p.is_deleted "isDeleted",
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
      LEFT JOIN post_tags pt ON ptp.tag_id = pt.id${where}
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
        p.is_deleted
      ORDER BY ${orderBy}
      LIMIT 12`,
      sqlArgs
    );

    if (page?.type === "before") savedPosts.reverse();

    const pageData: { after?: string; before?: string } = {};

    if (savedPosts.length > 0) {
      const cursorData = (type: GetPostsPageType): CursorDataTuple => {
        const [firstPost] = savedPosts;
        const lastPost = savedPosts.at(-1) as GetPostDBData;
        const sqlParams: (number | string)[] = [];
        let { order } = sort;
        let paramsCount = 0;
        let operator: string;
        let sortBy: string;
        let sqlStr: string;
        let bufStr: string;

        if (type === "before") {
          order = order === "ASC" ? "DESC" : "ASC";
          operator = sort.order === "DESC" ? ">" : "<";
        } else {
          operator = sort.order === "DESC" ? "<" : ">";
        }

        if (sort.column === "p.title") {
          const { title } = type === "before" ? firstPost : lastPost;

          sortBy = `p.title ${order}`;
          sqlStr = `SELECT id FROM posts AS p WHERE p.title ${operator} $${++paramsCount}`;
          sqlParams.push(title);
          bufStr = Buffer.from(title).toString("base64url");
        } else {
          let dateString: string, postId: number, bufferString: string;

          if (type === "before") {
            dateString = new Date(firstPost.dateCreated).toISOString();
            bufferString = `${dateString}_${firstPost.postId}`;
            ({ postId } = firstPost);
          } else {
            dateString = new Date(lastPost.dateCreated).toISOString();
            bufferString = `${dateString}_${lastPost.postId}`;
            ({ postId } = lastPost);
          }

          sortBy = `p.date_created ${order}, p.id ${order}`;
          sqlStr = `SELECT p.id FROM posts AS p WHERE p.date_created ${operator}= $${++paramsCount} AND p.id ${operator} $${++paramsCount}`;
          sqlParams.push(dateString, postId);
          bufStr = Buffer.from(bufferString).toString("base64url");
        }

        if (filters?.status) {
          sqlStr = `${sqlStr} AND p.status = $${++paramsCount}`;
          sqlParams.push(filters.status);
        }

        return [`${sqlStr} ORDER BY ${sortBy} LIMIT 1`, sqlParams, bufStr];
      };

      const [checkedBefore, checkedAfter] = await Promise.all([
        db.query(cursorData("before")[0], cursorData("before")[1]),
        db.query(cursorData("after")[0], cursorData("after")[1]),
      ]);

      if (checkedBefore.rows.length > 0) {
        [, , pageData.before] = cursorData("before");
      }

      if (checkedAfter.rows.length > 0) {
        [, , pageData.after] = cursorData("after");
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
