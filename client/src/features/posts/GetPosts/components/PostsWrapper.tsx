import Typography from "@mui/material/Typography";

interface PostsWrapperProps {
  children: React.ReactNode;
  id: string;
  ariaBusy: boolean;
}

const PostsWrapper = ({ children, id, ariaBusy }: PostsWrapperProps) => (
  <section aria-live="polite" aria-labelledby={id} aria-busy={ariaBusy}>
    <Typography variant="h1" id={id} gutterBottom>
      Blog Posts
    </Typography>
    {children}
  </section>
);

export default PostsWrapper;
