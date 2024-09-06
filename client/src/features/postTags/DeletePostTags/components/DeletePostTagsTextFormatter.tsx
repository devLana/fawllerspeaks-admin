import Typography from "@mui/material/Typography";
import { useGetCachePostTags } from "@features/postTags/GetPostTags/hooks/useGetCachePostTags";

interface FormatTextProps {
  name: string;
  idsLength: number;
}

const DeletePostTagsTextFormatter = ({ name, idsLength }: FormatTextProps) => {
  const cachePostTags = useGetCachePostTags();
  const numberOfTags = cachePostTags?.length ?? -1;

  if (numberOfTags === 1 || idsLength === 1) {
    return (
      <Typography variant="caption" fontSize="1em" fontWeight="bold">
        {name}
      </Typography>
    );
  }

  if (idsLength === numberOfTags) {
    return (
      <Typography variant="caption" fontSize="1em" fontWeight="bold">
        all post tags
      </Typography>
    );
  }

  return (
    <>
      these&nbsp;
      <Typography variant="caption" fontSize="1em" fontWeight="bold">
        {idsLength} post tags
      </Typography>
    </>
  );
};

export default DeletePostTagsTextFormatter;
