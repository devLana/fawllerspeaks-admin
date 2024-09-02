import Image from "next/image";

import Box from "@mui/material/Box";

interface PostImageBannerProps {
  imageLink: string;
  title: string;
}

const PostImageBanner = ({ imageLink, title }: PostImageBannerProps) => (
  <Box
    sx={{
      position: "relative",
      height: { height: 150, sm: 160 },
      borderTop: "1px solid",
      borderBottom: "1px solid",
      borderColor: "divider",
      bgcolor: "action.disabledBackground",
    }}
  >
    <Image
      src={imageLink}
      alt={`Image banner for ${title}`}
      fill
      style={{ objectFit: "cover" }}
      priority
    />
  </Box>
);

export default PostImageBanner;
