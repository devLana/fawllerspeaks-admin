import Typography from "@mui/material/Typography";

interface PostTagsWrapperProps {
  children: React.ReactElement;
  id: string;
  ariaBusy: boolean;
}

const PostTagsWrapper = ({ children, id, ariaBusy }: PostTagsWrapperProps) => (
  <section aria-live="polite" aria-labelledby={id} aria-busy={ariaBusy}>
    <Typography variant="h2" id={id} gutterBottom>
      Post Tags
    </Typography>
    {children}
  </section>
);

export default PostTagsWrapper;
