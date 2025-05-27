import dynamic from "next/dynamic";
import EditPostContentSkeleton from "./EditPostContentSkeleton";

export const LazyEditPostContent = dynamic(
  () => import(/* webpackChunkName: "EditPostContent" */ "."),
  { loading: () => <EditPostContentSkeleton />, ssr: false }
);
