import dynamic from "next/dynamic";
import EditPostPreviewSkeleton from "./EditPostPreviewSkeleton";

export const LazyEditPostPreview = dynamic(
  () => import(/* webpackChunkName: "EditPostPreview" */ "."),
  { loading: () => <EditPostPreviewSkeleton />, ssr: false }
);
