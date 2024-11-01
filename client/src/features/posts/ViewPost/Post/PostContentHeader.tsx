import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import PostDate from "@features/posts/components/PostDate";

interface PostContentHeaderProps {
  name: string;
  src: string | null | undefined;
  dateCreated: string;
}

const PostContentHeader = (props: PostContentHeaderProps) => {
  const { dateCreated, src, name } = props;

  return (
    <Box sx={{ display: "flex", columnGap: 2.5, mb: 4, alignItems: "center" }}>
      {src && <Avatar src={src} alt={name} sx={{ width: 50, height: 50 }} />}
      <Stack spacing={0.2}>
        <Typography sx={{ fontWeight: "bold" }}>{name}</Typography>
        <Typography variant="caption">
          Created on <PostDate dateString={dateCreated} />
        </Typography>
      </Stack>
    </Box>
  );
};

export default PostContentHeader;
