import * as React from "react";
import { useRouter } from "next/router";

import {
  type ApolloError,
  type QueryResult,
  useLazyQuery,
} from "@apollo/client";

import { usePostsFilters } from "./usePostsFilters";
import { GET_POSTS } from "@queries/getPosts/GET_POSTS";
import type {
  GetPostsPageType,
  PostStatus,
  QueryGetPostsArgs,
  SortPostsBy,
} from "@apiTypes";
import type { GetPostsPageData } from "types/posts/getPosts";

type UseGetPostsHookData = QueryResult<GetPostsPageData, QueryGetPostsArgs>;
type UseGetPostsHookResult = Omit<UseGetPostsHookData, "fetchMore" | "called">;

export const useGetPosts = (): UseGetPostsHookResult => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [fetchMoreError, setFetchMoreError] = React.useState<ApolloError>();
  const { query, isReady } = useRouter();

  const { gqlVariables } = usePostsFilters();

  const [getPosts, { fetchMore, called, error, loading: _, ...rest }] =
    useLazyQuery(GET_POSTS, { notifyOnNetworkStatusChange: true });

  React.useEffect(() => {
    if (isReady && !called) {
      const { status, sort, postsPage } = query;
      let variables: QueryGetPostsArgs | undefined;
      let filters: QueryGetPostsArgs["filters"];
      let page: QueryGetPostsArgs["page"];

      if (status && typeof status === "string") {
        const STATUS = `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
        filters = { ...filters, status: STATUS as PostStatus };
      }

      if (sort && typeof sort === "string") {
        filters = { ...filters, sort: sort as SortPostsBy };
      }

      if (Array.isArray(postsPage) && postsPage.length >= 2) {
        const [type, cursor] = postsPage as [GetPostsPageType, string];
        page = { type, cursor };
      }

      if (page && filters) {
        variables = { page, filters };
      } else if (page) {
        variables = { page };
      } else if (filters) {
        variables = { filters };
      }

      void getPosts({
        ...(variables && { variables }),
        onCompleted: () => setIsLoading(false),
        onError: () => setIsLoading(false),
      });
    }
  }, [called, getPosts, isReady, query]);

  React.useEffect(() => {
    if (called) {
      fetchMore({
        variables: gqlVariables,
        updateQuery: (__, { fetchMoreResult }) => fetchMoreResult,
      })
        .then(() => setFetchMoreError(undefined))
        .catch((err: ApolloError) => setFetchMoreError(err));
    }
  }, [fetchMore, gqlVariables, called]);

  return { ...rest, loading: isLoading, error: error || fetchMoreError };
};
