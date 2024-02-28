import Typography from "@mui/material/Typography";

interface PostTagsWrapperProps {
  children: React.ReactElement;
  id: string;
}

const PostTagsWrapper = ({ children, id }: PostTagsWrapperProps) => (
  <section>
    <Typography variant="h2" id={id} gutterBottom>
      Post Tags
    </Typography>
    {children}
  </section>
);

export default PostTagsWrapper;
