import Typography from "@mui/material/Typography";
import { useGetCachedPostTags } from "@hooks/getPostTags/useGetCachedPostTags";

interface FormatTextProps {
  name: string;
  idsLength: number;
}

const DeletePostTagsMessage = ({ name, idsLength }: FormatTextProps) => {
  const cachedPostTags = useGetCachedPostTags();
  const numberOfTags = cachedPostTags?.length ?? -1;

  if (idsLength === 1) {
    return (
      <Typography
        variant="caption"
        sx={{ fontSize: "1em", fontWeight: "bold" }}
      >
        {name}
      </Typography>
    );
  }

  if (idsLength === numberOfTags) {
    return (
      <Typography
        variant="caption"
        sx={{ fontSize: "1em", fontWeight: "bold" }}
      >
        all post tags
      </Typography>
    );
  }

  return (
    <>
      these{" "}
      <Typography
        variant="caption"
        sx={{ fontSize: "1em", fontWeight: "bold" }}
      >
        {idsLength} post tags
      </Typography>
    </>
  );
};

export default DeletePostTagsMessage;
