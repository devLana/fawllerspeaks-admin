import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";

import useStatusAlert from "../hooks/useStatusAlert";

interface PostsWrapperProps {
  children: React.ReactElement;
  id: string;
  ariaBusy: boolean;
}

const PostsWrapper = ({ children, id, ariaBusy }: PostsWrapperProps) => {
  const { onClose, message, open } = useStatusAlert();

  return (
    <section aria-live="polite" aria-labelledby={id} aria-busy={ariaBusy}>
      <Typography variant="h1" id={id} gutterBottom>
        Blog Posts
      </Typography>
      {children}
      <Snackbar open={open} onClose={onClose} message={message} />
    </section>
  );
};

export default PostsWrapper;
