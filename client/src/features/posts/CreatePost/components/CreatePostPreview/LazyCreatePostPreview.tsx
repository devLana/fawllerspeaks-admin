import dynamic from "next/dynamic";
import CreatePostPreviewSkeleton from "./CreatePostPreviewSkeleton";

export const LazyCreatePostPreview = dynamic(
  () => import(/* webpackChunkName: "CreatePostPreview" */ "."),
  { loading: () => <CreatePostPreviewSkeleton />, ssr: false }
);
