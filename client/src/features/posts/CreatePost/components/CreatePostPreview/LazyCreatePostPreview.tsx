import dynamic from "next/dynamic";
import PostPreviewSkeleton from "./components/PostPreviewSkeleton";

export const LazyCreatePostPreview = dynamic(
  () => import(/* webpackChunkName: "CreatePostPreview" */ "."),
  { loading: () => <PostPreviewSkeleton />, ssr: false }
);
