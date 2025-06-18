import * as React from "react";
import { useRouter } from "next/router";

import * as yup from "yup";

import { getPostsFiltersSchema as schema } from "@validators/getPostsFiltersSchema";
import type { PostStatus, QueryGetPostsArgs } from "@apiTypes";
import type {
  FiltersErrors,
  PostsQueryParams,
  RuntimeError,
} from "types/posts/getPosts";

interface PostsFilters {
  gqlVariables: QueryGetPostsArgs;
  queryParams: PostsQueryParams;
  paramsErrors: FiltersErrors | RuntimeError | null;
}

export const usePostsFilters = (): PostsFilters => {
  const { query } = useRouter();
  const { status, sort, params } = query;

  const parseQuery = React.useMemo<PostsFilters>(() => {
    const rawParams: { filters?: object; page?: object } = {};

    if (status || sort) {
      rawParams.filters = { status, sort };
    }

    if (params && Array.isArray(params)) {
      rawParams.page = params;
    }

    try {
      const parsed = schema.validateSync(rawParams, { abortEarly: false });
      const queryParams: PostsQueryParams = {};
      const gqlVariables: QueryGetPostsArgs = {};

      if (parsed.filters) {
        const { filters } = parsed;

        gqlVariables.filters = filters;

        if (filters?.status) {
          const STATUS = filters.status.toLowerCase() as Lowercase<PostStatus>;
          queryParams.status = STATUS;
        }

        if (filters?.sort) {
          queryParams.sort = filters.sort;
        }
      }

      if (parsed.page) {
        const [type, cursor] = parsed.page;

        gqlVariables.page = { type, cursor };
        queryParams.cursor = cursor;
        queryParams.type = type;
      }

      return { gqlVariables, queryParams, paramsErrors: null };
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        const paramsErrors = e.inner.reduce<FiltersErrors>(
          (validationErrors, { path, params: param }) => {
            if (!path) return validationErrors;

            if (path === "page[0]") {
              return {
                ...validationErrors,
                type: param?.originalValue as string,
              };
            }

            const key = path.split(".")[1] as "sort" | "status";
            return {
              ...validationErrors,
              [key]: param?.originalValue as string,
            };
          },
          { errorType: "ValidationError" }
        );

        return { gqlVariables: {}, queryParams: {}, paramsErrors };
      }

      const paramsErrors: RuntimeError = { errorType: "RuntimeError" };
      return { gqlVariables: {}, queryParams: {}, paramsErrors };
    }
  }, [params, sort, status]);

  return parseQuery;
};
