import type {
  GetPosts,
  GetPostsData,
  GetPostsPageType,
  Post,
  PostStatus,
  SortPostsBy,
} from "@apiTypes";
import type { PostData } from "types/posts";

type PostsPageDataKeys =
  | "id"
  | "title"
  | "imageBanner"
  | "status"
  | "dateCreated";

type ValidationErrorKeys =
  | "qError"
  | "sortError"
  | "typeError"
  | "statusError"
  | "postTagError";

export type PostsView = "list" | "grid";
export type PostItemSlug = Pick<PostData["url"], "slug">;

export type PostsPagePostData = Pick<PostData, PostsPageDataKeys> & {
  url: PostItemSlug;
};

type PostsPageDataMapper<T extends object> = T extends { posts: Post[] }
  ? Omit<T, "posts" | "status"> & { posts: PostsPagePostData[] }
  : T extends { __typename?: "GetPostsValidationError" }
  ? Omit<T, ValidationErrorKeys | "status">
  : Omit<T, "status">;

export interface GetPostsPageData {
  getPosts: PostsPageDataMapper<GetPosts>;
}

export type PostsPageData = PostsPageDataMapper<GetPostsData>;

export interface GetPostsListState {
  postsView: PostsView;
  delete: { open: boolean; title: string; ids: string[] };
  selectedPosts: Record<string, string>;
}

export type GetPostsListAction =
  | {
      type: "CHANGE_POST_LIST_VIEW";
      payload: { view: PostsView };
    }
  | { type: "OPEN_DELETE"; payload: { title: string; ids: string[] } }
  | { type: "CLOSE_DELETE" }
  | { type: "TOGGLE_ALL_POSTS_SELECT"; payload: { posts: PostsPagePostData[] } }
  | {
      type: "SELECT_POST";
      payload: { checked: boolean; title: string; id: string };
    }
  | {
      type: "SHIFT_PLUS_CLICK";
      payload: {
        anchorPost: { id: string; index: number };
        targetIndex: number;
        prevTargetIndex: number | null;
        posts: PostsPagePostData[];
      };
    };

export interface PostsQueryParams {
  type?: GetPostsPageType;
  cursor?: string;
  status?: Lowercase<PostStatus>;
  sort?: SortPostsBy;
}

export type FiltersErrors = Partial<Record<keyof PostsQueryParams, string>> & {
  errorType: "ValidationError";
};

export interface RuntimeError {
  errorType: "RuntimeError";
}
