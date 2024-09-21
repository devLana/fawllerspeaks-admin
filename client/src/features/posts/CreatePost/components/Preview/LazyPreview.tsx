import dynamic from "next/dynamic";
import PreviewSkeleton from "./PreviewSkeleton";

export const LazyPreview = dynamic(
  () => import(/* webpackChunkName: "Preview" */ "."),
  { loading: () => <PreviewSkeleton />, ssr: false }
);
