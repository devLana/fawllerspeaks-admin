import * as React from "react";
import dynamic from "next/dynamic";

import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import { useDraftPost } from "@features/posts/CreatePost/hooks/useDraftPost";
import RootLayout from "@layouts/RootLayout";
import PostContentSkeleton from "@features/posts/CreatePost/components/PostContent/components/PostContentSkeleton";
import PostMetadata from "@features/posts/CreatePost/components/PostMetadata";
import PostFileInput from "@features/posts/CreatePost/components/PostMetadata/components/PostFileInput";
import SelectPostTags from "@features/posts/CreatePost/components/PostMetadata/components/SelectPostTags";
import uiLayout from "@utils/uiLayout";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { NextPageWithLayout, PostData, PostView, Status } from "@types";

const PostContent = dynamic(
  () => {
    return import(
      /* webpackChunkName: "PostContent" */ "@features/posts/CreatePost/components/PostContent"
    );
  },
  { loading: () => <PostContentSkeleton />, ssr: false }
);

const CreatePostPage: NextPageWithLayout = () => {
  const [view, setView] = React.useState<PostView>("metadata");
  const [postData, setPostData] = React.useState<PostData>({
    title: "",
    description: "",
    content: "",
  });

  const { handleDraftPost, setDraftStatus, draftStatus, msg } = useDraftPost(
    postData,
    setPostData
  );

  const handlePostTags = (selectedTags: string[]) => {
    if (selectedTags.length === 0) {
      const { tags: _, ...rest } = postData;
      setPostData(rest);
    } else {
      setPostData({ ...postData, tags: selectedTags });
    }
  };

  const handlePostImage = (imageFile?: File) => {
    if (imageFile) {
      setPostData({ ...postData, imageBanner: imageFile });
    } else {
      const { imageBanner: _, ...rest } = postData;
      setPostData(rest);
    }
  };

  const handleMetadata = (title: string, description: string) => {
    setPostData({ ...postData, title, description });
  };

  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostData({ ...postData, title: e.target.value });
  };

  const handleContent = (content: string) => {
    setPostData({ ...postData, content });
  };

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Create A New Blog Post
      </Typography>
      {view === "metadata" ? (
        <PostMetadata
          onInput={handleTitle}
          title={postData.title}
          description={postData.description}
          draftStatus={draftStatus}
          handleMetadata={handleMetadata}
          handleDraftPost={handleDraftPost}
          setView={setView}
          selectPostTags={
            <SelectPostTags
              tags={postData.tags}
              onSelectTags={handlePostTags}
            />
          }
          fileInput={
            <PostFileInput
              onSelectImage={handlePostImage}
              imageBanner={postData.imageBanner}
            />
          }
        />
      ) : view === "content" ? (
        <PostContent
          content={postData.content}
          draftStatus={draftStatus}
          handleContent={handleContent}
          handleDraftPost={handleDraftPost}
          setView={setView}
        />
      ) : null}
      <Snackbar
        message={msg}
        open={draftStatus === "error"}
        onClose={handleCloseAlert<Status>("idle", setDraftStatus)}
      />
    </>
  );
};

CreatePostPage.layout = uiLayout(RootLayout, { title: "Create New Blog Post" });

export default CreatePostPage;
