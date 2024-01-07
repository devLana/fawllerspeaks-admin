import Typography from "@mui/material/Typography";
import { useGetCachePostTags } from "@hooks/useGetCachePostTags";

interface FormatTextProps {
  name: string;
  idsLength: number;
}

const DeletePostTagsTextFormatter = ({ name, idsLength }: FormatTextProps) => {
  const cachedTags = useGetCachePostTags();
  const numberOfTags = cachedTags?.length ?? -1;

  if (idsLength === 1) {
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
