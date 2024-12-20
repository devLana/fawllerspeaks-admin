import Snackbar from "@mui/material/Snackbar";
import useStatusAlert from "@hooks/viewPost/useStatusAlert";

type PostWrapperProps = React.PropsWithChildren<{
  ariaBusy?: boolean;
  label: string;
}>;

const PostWrapper = (props: PostWrapperProps) => {
  const { ariaBusy = false, children, label } = props;
  const { onClose, message, open } = useStatusAlert();

  return (
    <section aria-live="polite" aria-label={label} aria-busy={ariaBusy}>
      {children}
      <Snackbar open={open} onClose={onClose} message={message} />
    </section>
  );
};

export default PostWrapper;
