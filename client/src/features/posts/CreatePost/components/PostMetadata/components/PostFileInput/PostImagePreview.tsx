import Image from "next/image";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import HideImageOutlinedIcon from "@mui/icons-material/HideImageOutlined";

interface PostImagePreviewProps {
  id: string;
  src: string;
  onClick: () => void;
  onKeydown: (e: React.KeyboardEvent<HTMLLabelElement>) => void;
}

const PostImagePreview = (props: PostImagePreviewProps) => {
  const { id, src, onKeydown, onClick } = props;

  return (
    <Box
      position="relative"
      width="100%"
      height={{ height: 200, sm: 250, md: 280 }}
      maxWidth={700}
      borderRadius={1}
      overflow="hidden"
    >
      <Image
        src={src}
        alt="Post image banner preview"
        fill
        style={{ objectFit: "cover" }}
      />
      <Stack position="absolute" top={8} right={8} rowGap={1}>
        <Tooltip title="Change Image" placement="left">
          <IconButton
            htmlFor={id}
            component="label"
            size="small"
            onKeyDown={onKeydown}
            sx={{
              bgcolor: "background.default",
              color: "text.primary",
              "&:hover": { bgcolor: "background.default" },
            }}
          >
            <AddPhotoAlternateOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove Image" placement="left">
          <IconButton
            size="small"
            onClick={onClick}
            sx={{
              bgcolor: "background.default",
              color: "text.primary",
              "&:hover": { bgcolor: "background.default" },
            }}
          >
            <HideImageOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default PostImagePreview;
