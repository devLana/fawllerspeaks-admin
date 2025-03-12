import FormControl from "@mui/material/FormControl";
import TooltipHint from "../TooltipHint";

interface ImageBannerWrapperProps {
  hasError: boolean;
  children: React.ReactNode;
}

const PostImageBannerInputWrapper = (props: ImageBannerWrapperProps) => {
  const { hasError, children } = props;

  return (
    <TooltipHint hint="An optional image banner that can give visual meaning to this post">
      <FormControl fullWidth error={hasError}>
        {children}
      </FormControl>
    </TooltipHint>
  );
};

export default PostImageBannerInputWrapper;
