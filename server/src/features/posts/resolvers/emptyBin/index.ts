import { GraphQLError } from "graphql";

import { Posts } from "../types/Posts";
import { EmptyBinWarning } from "./EmptyBinWarning";
import getPostSlug from "@features/posts/utils/getPostSlug";
// import mapPostTags from "@features/posts/utils/mapPostTags";
import { NotAllowedError } from "@utils/ObjectTypes";
import dateToISOString from "@utils/dateToISOString";

import type { MutationResolvers, PostTag } from "@resolverTypes";
import type { GetPostDBData, ResolverFunc } from "@types";

type EmptyBin = ResolverFunc<MutationResolvers["emptyBin"]>;

interface DbUser {
  isRegistered: boolean;
  name: string;
  image: string | null;
}

type DbPost = Omit<GetPostDBData, "author" | "isInBin" | "isDeleted">;

const emptyBin: EmptyBin = async (_, __, { db, user }) => {
  try {
    if (!user) return new NotAllowedError("Unable to empty all posts from bin");

    const checkUser = db.query<DbUser>(
      `SELECT
        is_Registered "isRegistered",
        first_name || ' ' || last_name name,
        image
      FROM users WHERE user_id = $1`,
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

    const [{ rows: checkedUser }, { rows: postTags }] = await Promise.all([
      checkUser,
      allPostTags,
    ]);

    if (checkedUser.length === 0 || !checkedUser[0].isRegistered) {
      return new NotAllowedError("Unable to empty all posts from bin");
    }
    const [{ name, image }] = checkedUser;

    const map = new Map<string, PostTag>();

    postTags.forEach(postTag => {
      const tag = {
        ...postTag,
        dateCreated: dateToISOString(postTag.dateCreated),
        lastModified: postTag.lastModified
          ? dateToISOString(postTag.lastModified)
          : postTag.lastModified,
      };

      map.set(tag.id, tag);
    });

    const { rows: emptiedPosts } = await db.query<DbPost>(
      `UPDATE posts
      SET is_deleted = $1
      WHERE author = $2
      AND is_in_bin = $3
      RETURNING
        post_id "postId",
        title,
        description,
        content,
        status,
        slug,
        image_banner "imageBanner",
        date_created "dateCreated",
        date_published "datePublished",
        last_modified "lastModified",
        views,
        likes,
        tags`,
      [true, user, true]
    );

    if (emptiedPosts.length === 0) {
      return new EmptyBinWarning("You have no posts in your bin to delete");
    }

    const posts = emptiedPosts.map(post => {
      const slug = getPostSlug(post.title);
      // const tags = post.tags ? mapPostTags(post.tags, map) : null;

      return {
        id: post.id,
        title: post.title,
        description: post.description,
        content: null,
        author: { name, image },
        status: post.status,
        url: { href: "", slug },
        imageBanner: post.imageBanner,
        dateCreated: dateToISOString(post.dateCreated),
        datePublished: post.datePublished
          ? dateToISOString(post.datePublished)
          : post.datePublished,
        lastModified: post.lastModified
          ? dateToISOString(post.lastModified)
          : post.lastModified,
        views: post.views,
        isInBin: true,
        isDeleted: true,
        tags: null,
      };
    });

    return new Posts(posts);
  } catch {
    throw new GraphQLError(
      "Unable to empty all posts from bin. Please try again later"
    );
  }
};

export default emptyBin;
