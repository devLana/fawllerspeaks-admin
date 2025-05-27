import Typography from "@mui/material/Typography";

type EditPostWrapperProps = React.PropsWithChildren<{
  ariaBusy?: boolean;
  id: string;
}>;

const EditPostWrapper = (props: EditPostWrapperProps) => {
  const { ariaBusy = false, children, id } = props;

  return (
    <article aria-live="polite" aria-labelledby={id} aria-busy={ariaBusy}>
      <Typography variant="h1" gutterBottom id={id}>
        Edit Blog Post
      </Typography>
      {children}
    </article>
  );
};

export default EditPostWrapper;
