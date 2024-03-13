import { GraphQLError } from "graphql";

import { Posts } from "../types/Posts";
import getPostUrl from "@features/posts/utils/getPostUrl";
// import  mapPostTags from "@features/posts/utils/mapPostTags";
import { NotAllowedError } from "@utils/ObjectTypes";
import dateToISOString from "@utils/dateToISOString";

import type { QueryResolvers, PostTag } from "@resolverTypes";
import type { GetPostDBData, ResolverFunc } from "@types";

type GetPosts = ResolverFunc<QueryResolvers["getPosts"]>;

const getPosts: GetPosts = async (_, __, { db, user }) => {
  try {
    if (!user) return new NotAllowedError("Unable to retrieve posts");

    const checkUser = db.query<{ isRegistered: boolean }>(
      `SELECT is_registered "isRegistered" FROM users WHERE user_id = $1`,
      [user]
    );

    const allPostTags = db.query<PostTag>(
      `SELECT
        tag_id id,
        name,
        date_created "dateCreated",
        last_modified "lastModified"
      FROM post_tags`
    );

    const allPosts = db.query<GetPostDBData>(`
      SELECT
        post_id "postId",
        title,
        description,
        content,
        first_name || ' ' || last_name author,
        status,
        slug,
        image_banner "imageBanner",
        posts.date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        likes,
        is_in_bin "isInBin",
        is_deleted "isDeleted",
        tags
      FROM posts LEFT JOIN users ON author = user_id`);

    const [foundUser, postTags, savedPosts] = await Promise.all([
      checkUser,
      allPostTags,
      allPosts,
    ]);

    const { rows: findUser } = foundUser;

    if (findUser.length === 0 || !findUser[0].isRegistered) {
      return new NotAllowedError("Unable to retrieve posts");
    }

    const map = new Map<string, PostTag>();

    postTags.rows.forEach(postTag => {
      const tag = {
        ...postTag,
        dateCreated: dateToISOString(postTag.dateCreated),
        lastModified: postTag.lastModified
          ? dateToISOString(postTag.lastModified)
          : postTag.lastModified,
      };

      map.set(tag.id, tag);
    });

    const posts = savedPosts.rows.map(post => {
      const { url, slug } = getPostUrl(post.title);
      // const tags = post.tags ? mapPostTags(post.tags, map) : null;

      return {
        id: post.postId,
        title: post.title,
        description: post.description,
        content: post.content,
        author: post.author,
        status: post.status,
        url,
        slug,
        imageBanner: post.imageBanner,
        dateCreated: dateToISOString(post.dateCreated),
        datePublished: post.datePublished
          ? dateToISOString(post.datePublished)
          : post.datePublished,
        lastModified: post.lastModified
          ? dateToISOString(post.lastModified)
          : post.lastModified,
        views: post.views,
        isInBin: post.isInBin,
        isDeleted: post.isDeleted,
        tags: null,
      };
    });

    return new Posts(posts);
  } catch {
    throw new GraphQLError("Unable to retrieve posts. Please try again later");
  }
};

export default getPosts;
