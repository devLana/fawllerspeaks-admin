import dynamic from "next/dynamic";
import CreatePostContentSkeleton from "./components/CreatePostContentSkeleton";

export const LazyCreatePostContent = dynamic(
  () => import(/* webpackChunkName: "CreatePostContent" */ "."),
  { loading: () => <CreatePostContentSkeleton />, ssr: false }
);
