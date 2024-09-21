import dynamic from "next/dynamic";
import ContentSkeleton from "./ContentSkeleton";

export const LazyContent = dynamic(
  () => import(/* webpackChunkName: "Content" */ "."),
  { loading: () => <ContentSkeleton />, ssr: false }
);
