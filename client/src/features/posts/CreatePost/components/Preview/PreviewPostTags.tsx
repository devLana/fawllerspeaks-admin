import { useApolloClient } from "@apollo/client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Chip from "@mui/material/Chip";

import { GET_POST_TAG_NAME } from "@fragments/GET_POST_TAG_NAME";

const PreviewPostTags = ({ tagIds }: { tagIds: string[] }) => {
  const client = useApolloClient();

  if (tagIds.length === 0) return null;

  const selectedTags = tagIds.map(tagId => {
    const id = `PostTag:${tagId}`;
    const tag = client.readFragment({ fragment: GET_POST_TAG_NAME, id });

    return (
      <ListItem key={tagId} disablePadding sx={{ width: "auto" }}>
        <Chip label={tag?.name} sx={{ maxWidth: "15em" }} />
      </ListItem>
    );
  });

  return (
    <List
      aria-label="post tags"
      disablePadding
      sx={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: 0.5,
        rowGap: 1,
        mt: 3,
        pt: { md: 3 },
        borderTop: { md: "1px solid" },
        borderColor: { md: "divider" },
      }}
    >
      {selectedTags}
    </List>
  );
};

export default PreviewPostTags;
