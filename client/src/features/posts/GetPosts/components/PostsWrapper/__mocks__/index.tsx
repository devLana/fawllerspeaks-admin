interface PostsWrapperProps {
  children?: React.ReactNode;
  id: string;
  ariaBusy: boolean;
}

const PostsWrapper = ({ children, id, ariaBusy }: PostsWrapperProps) => (
  <section aria-live="polite" aria-labelledby={id} aria-busy={ariaBusy}>
    <h1 id={id}>Blog Posts</h1>
    {children}
  </section>
);

export default PostsWrapper;
