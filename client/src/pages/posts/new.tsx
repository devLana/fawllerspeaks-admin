import * as React from "react";

import Typography from "@mui/material/Typography";

import uiLayout from "@utils/uiLayout";
import RootLayout from "@layouts/RootLayout";
import PostMetadata from "@features/posts/CreatePost/components/PostMetadata";
import PostFileInput from "@features/posts/CreatePost/components/PostMetadata/components/PostFileInput";
import SelectPostTags from "@features/posts/CreatePost/components/PostMetadata/components/SelectPostTags";
import type { NextPageWithLayout, PostData, PostView } from "@types";

const CreatePostPage: NextPageWithLayout = () => {
  const [view, setView] = React.useState<PostView>("metadata");
  const [postData, setPostData] = React.useState<PostData>({
    title: "",
    description: "",
    content: "",
  });

  const handlePostTags = (selectedTags: string[]) => {
    if (selectedTags.length === 0) {
      const { tags: _, ...data } = postData;
      setPostData(data);
    } else {
      setPostData({ ...postData, tags: selectedTags });
    }
  };

  const handlePostImage = (imageFile?: File) => {
    if (imageFile) {
      setPostData({ ...postData, imageBanner: imageFile });
    } else {
      const { imageBanner: _, ...data } = postData;
      setPostData(data);
    }
  };

  const handleMetadata = (title: string, description: string) => {
    setPostData({ ...postData, title, description });
  };

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Create A New Blog Post
      </Typography>
      {view === "metadata" ? (
        <PostMetadata
          setView={setView}
          title={postData.title}
          description={postData.description}
          handleMetadata={handleMetadata}
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
      ) : null}
    </>
  );
};

CreatePostPage.layout = uiLayout(RootLayout, { title: "Create New Blog Post" });

export default CreatePostPage;
