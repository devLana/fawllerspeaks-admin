import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";

import PostImageBanner from "@features/posts/components/PostImageBanner";

interface PostImagePreviewProps {
  id: string;
  src: string;
  onClick: () => void;
  onKeydown: (e: React.KeyboardEvent<HTMLLabelElement>) => void;
}

const PostImagePreview = (props: PostImagePreviewProps) => {
  const { id, src, onKeydown, onClick } = props;

  return (
    <PostImageBanner
      src={src}
      alt="Post image banner preview"
      sx={{
        width: "100%",
        height: { height: 200, sm: 250, md: 280 },
        maxWidth: 700,
        borderRadius: 1,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "primary.light",
      }}
    >
      <Stack sx={{ position: "absolute", top: 8, right: 8, rowGap: 1 }}>
        <Tooltip title="Change Image" placement="left">
          <IconButton
            role={undefined}
            htmlFor={id}
            component="label"
            size="small"
            onKeyDown={onKeydown}
            sx={{
              p: 1,
              bgcolor: "themeColor.transparent",
              color: "#fff",
              "&:hover": { bgcolor: "themeColor.transparent" },
            }}
          >
            <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Image" placement="left">
          <IconButton
            size="small"
            onClick={onClick}
            sx={{
              p: 1,
              bgcolor: "themeColor.transparent",
              color: "#fff",
              "&:hover": { bgcolor: "themeColor.transparent" },
            }}
          >
            <HideImageOutlinedIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Tooltip>
      </Stack>
    </PostImageBanner>
  );
};

export default PostImagePreview;
