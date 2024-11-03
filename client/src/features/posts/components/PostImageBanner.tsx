import Image from "next/image";
import Box, { type BoxProps } from "@mui/material/Box";
import type { SxPropsArray } from "@types";

interface PostImageBannerProps {
  src: string;
  alt: string;
  sizes?: string;
  sx?: BoxProps["sx"];
  children?: React.ReactElement;
}

const PostImageBanner = (props: PostImageBannerProps) => {
  const { src, sx = [], alt, sizes, children } = props;
  const sxProps: SxPropsArray = Array.isArray(sx) ? sx : [sx];

  return (
    <Box sx={[{ position: "relative" }, ...sxProps]}>
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        sizes={sizes}
        priority
      />
      {children}
    </Box>
  );
};

export default PostImageBanner;
