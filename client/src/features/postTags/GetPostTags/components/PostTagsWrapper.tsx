interface PostTagsWrapperProps {
  id: string;
  children: React.ReactElement;
  ariaBusy: boolean;
}

const PostTagsWrapper = ({ children, id, ariaBusy }: PostTagsWrapperProps) => (
  <section aria-live="polite" aria-labelledby={id} aria-busy={ariaBusy}>
    {children}
  </section>
);

export default PostTagsWrapper;
