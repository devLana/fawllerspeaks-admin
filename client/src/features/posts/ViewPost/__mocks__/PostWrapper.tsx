type PostWrapperProps = React.PropsWithChildren<{
  ariaBusy?: boolean;
  label: string;
}>;

const PostWrapper = (props: PostWrapperProps) => {
  const { ariaBusy = false, children, label } = props;

  return (
    <section aria-live="polite" aria-label={label} aria-busy={ariaBusy}>
      {children}
    </section>
  );
};

export default PostWrapper;
