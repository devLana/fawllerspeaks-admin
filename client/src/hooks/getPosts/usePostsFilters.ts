import * as React from "react";
import { useRouter } from "next/router";

import * as yup from "yup";

import { getPostsSchema as schema } from "@validators/getPostsSchema";
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
  const { params, size, sort, status } = query;

  const parseQuery = React.useMemo<PostsFilters>(() => {
    const rawParams: Record<string, unknown> = {};

    if (size) {
      rawParams.size = size;
    }

    if (status) {
      rawParams.status = status;
    }

    if (sort) {
      rawParams.sort = sort;
    }

    if (params && Array.isArray(params)) {
      const [after, cursor] = params;
      rawParams[after] = cursor;
    }

    try {
      const parsed = schema.validateSync(rawParams, { abortEarly: false });
      const gqlVariables: QueryGetPostsArgs = parsed;

      const queryParams: PostsQueryParams = {
        after: parsed.after,
        size: parsed.size,
        sort: parsed.sort,
      };

      if (parsed.status) {
        const STATUS = parsed.status.toLowerCase() as Lowercase<PostStatus>;
        queryParams.status = STATUS;
        gqlVariables.status = parsed.status;
      }

      return { gqlVariables, queryParams, paramsErrors: null };
    } catch (e) {
      if (e instanceof yup.ValidationError) {
        const paramsErrors = e.inner.reduce<FiltersErrors>(
          (validationErrors, { path, params: param }) => {
            if (!path) return validationErrors;

            return {
              ...validationErrors,
              [path]: param?.originalValue as string,
            };
          },
          { errorType: "ValidationError" }
        );

        return { gqlVariables: {}, queryParams: {}, paramsErrors };
      }

      const paramsErrors: RuntimeError = { errorType: "RuntimeError" };
      return { gqlVariables: {}, queryParams: {}, paramsErrors };
    }
  }, [params, size, sort, status]);

  return parseQuery;
};
