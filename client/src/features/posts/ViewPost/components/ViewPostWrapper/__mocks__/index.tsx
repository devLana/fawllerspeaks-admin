type ViewPostWrapperProps = React.PropsWithChildren<{
  ariaBusy?: boolean;
  label: string;
}>;

const ViewPostWrapper = (props: ViewPostWrapperProps) => {
  const { ariaBusy = false, children, label } = props;

  return (
    <section aria-live="polite" aria-label={label} aria-busy={ariaBusy}>
      {children}
    </section>
  );
};

export default ViewPostWrapper;
