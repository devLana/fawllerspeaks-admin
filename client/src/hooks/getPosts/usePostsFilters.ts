import * as React from "react";
import { useRouter } from "next/router";

import type {
  GetPostsPageType,
  PostStatus,
  QueryGetPostsArgs,
  SortPostsBy,
} from "@apiTypes";

interface PostsQueryParams {
  type?: GetPostsPageType;
  cursor?: string;
  status?: Lowercase<PostStatus>;
  sort?: SortPostsBy;
}

interface PostsFilters {
  gqlVariables: QueryGetPostsArgs | undefined;
  queryParams: PostsQueryParams;
}

export const usePostsFilters = (): PostsFilters => {
  const { query } = useRouter();
  const { status, sort, postsPage } = query;

  const parseQuery: PostsFilters = React.useMemo(() => {
    const queryParams: PostsQueryParams = {};
    let filters: QueryGetPostsArgs["filters"];
    let page: QueryGetPostsArgs["page"];
    let gqlVariables: QueryGetPostsArgs | undefined;

    if (status && typeof status === "string") {
      const STATUS = `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
      filters = { ...filters, status: STATUS as PostStatus };
      queryParams.status = status as Lowercase<PostStatus>;
    }

    if (sort && typeof sort === "string") {
      filters = { ...filters, sort: sort as SortPostsBy };
      queryParams.sort = sort as SortPostsBy;
    }

    if (Array.isArray(postsPage) && postsPage.length >= 2) {
      const [type, cursor] = postsPage as [GetPostsPageType, string];

      page = { type, cursor };
      queryParams.type = type;
      queryParams.cursor = cursor;
    }

    if (page && filters) {
      gqlVariables = { page, filters };
    } else if (page) {
      gqlVariables = { page };
    } else if (filters) {
      gqlVariables = { filters };
    }

    return { queryParams, gqlVariables };
  }, [postsPage, sort, status]);

  return parseQuery;
};
