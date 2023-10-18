import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface PostTagsWrapperProps {
  children: React.ReactElement;
  id: string;
}

const PostTagsWrapper = ({ children, id }: PostTagsWrapperProps) => (
  <Box component="section">
    <Typography variant="h2" id={id} gutterBottom>
      Post Tags
    </Typography>
    {children}
  </Box>
);

export default PostTagsWrapper;
