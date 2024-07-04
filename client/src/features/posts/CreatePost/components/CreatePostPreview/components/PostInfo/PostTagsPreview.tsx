import { useApolloClient } from "@apollo/client";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

import { GET_POST_TAG_NAME } from "../../operations/GET_POST_TAG_NAME";

const PostTagsPreview = ({ tagIds }: { tagIds: string[] }) => {
  const client = useApolloClient();

  if (tagIds.length === 0) return null;

  const selectedTags = tagIds.map(tagId => {
    const id = `PostTag:${tagId}`;
    const tag = client.readFragment({ fragment: GET_POST_TAG_NAME, id });

    return <Chip key={tagId} label={tag?.name} sx={{ maxWidth: "15.5em" }} />;
  });

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={1.25}
      mt={3}
      pt={{ md: 3 }}
      borderTop={{ md: "1px solid" }}
      borderColor={{ md: "divider" }}
    >
      {selectedTags}
    </Box>
  );
};

export default PostTagsPreview;
