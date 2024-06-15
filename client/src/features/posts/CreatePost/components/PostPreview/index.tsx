import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import SectionHeader from "../SectionHeader";
import ActionButtons from "../ActionButtons";
import PostInfoPreview from "./components/PostInfo/PostInfoPreview";
import PostTagsPreview from "./components/PostInfo/PostTagsPreview";
import PostImageBannerPreview from "./components/PostContent/PostImageBannerPreview";
import PostContentPreview from "./components/PostContent/PostContentPreview";
import PostPreviewActionsMenu from "./components/PostPreviewActionsMenu";
import type { CreatePostAction, CreatePostData, Status } from "@types";

interface PostPreviewProps extends Omit<CreatePostData, "imageBanner"> {
  imageBanner: string | undefined;
  draftStatus: Status;
  dispatch: React.Dispatch<CreatePostAction>;
  handleDraftPost: () => Promise<void>;
}

const PostPreview = ({
  draftStatus,
  dispatch,
  handleDraftPost,
  title,
  description,
  excerpt,
  content,
  imageBanner,
  tags,
}: PostPreviewProps) => {
  const handlePublish = async () => {};

  const handleGoBack = () => {
    dispatch({ type: "CHANGE_VIEW", payload: { view: "content" } });
  };

  return (
    <section
      aria-live="polite"
      aria-busy="false"
      aria-labelledby="post-preview-label"
    >
      <SectionHeader
        onClick={handleGoBack}
        id="post-preview-label"
        buttonLabel="Go back to provide post content section"
        heading="Preview blog post"
        actionsMenu={
          <PostPreviewActionsMenu
            onPublish={handlePublish}
            onDraft={handleDraftPost}
          />
        }
      />
      <Box
        mt={{ md: 6 }}
        display={{ md: "grid" }}
        gridTemplateColumns={{ md: "1fr 2fr" }}
        gridTemplateRows={{ md: "1fr 1fr" }}
        columnGap={{ md: 4 }}
        rowGap={{ md: 5 }}
      >
        <Box
          component="aside"
          pb={{ md: 2 }}
          px={{ md: 2 }}
          gridArea={{ md: "1 / 1 / 3 / 2" }}
          alignSelf={{ md: "start" }}
          border={{ md: "1px solid" }}
          borderColor={{ md: "divider" }}
          borderRadius={{ md: 1 }}
          sx={({ breakpoints: { down } }) => ({
            [down("md")]: {
              pb: 5,
              mb: 5,
              borderBottom: "1px solid",
              borderBottomColor: "divider",
            },
          })}
        >
          <PostInfoPreview
            title={title}
            description={description}
            excerpt={excerpt}
          />
          <PostTagsPreview tagIds={tags ?? []} />
        </Box>
        <Box
          component="article"
          pb={5}
          borderBottom="1px solid"
          borderColor="divider"
          gridArea={{ md: "1 / 2 / 2 / 3" }}
          sx={({ breakpoints: { down } }) => ({ [down("md")]: { mb: 5 } })}
        >
          <Typography
            variant="h2"
            gutterBottom
            sx={({ typography }) => ({ ...typography.h1 })}
          >
            {title}
          </Typography>
          <PostImageBannerPreview imageBanner={imageBanner} title={title} />
          <PostContentPreview content={content} />
        </Box>
        <ActionButtons
          label="Publish post"
          status={draftStatus}
          onDraft={handleDraftPost}
          onNext={handlePublish}
          sx={{ gridArea: { md: "2 / 2 / 3 / 3" }, alignSelf: { md: "start" } }}
        />
      </Box>
    </section>
  );
};

export default PostPreview;
