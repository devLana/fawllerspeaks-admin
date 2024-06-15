import { gql, useApolloClient, type TypedDocumentNode } from "@apollo/client";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

const GET_POST_TAG_NAME: TypedDocumentNode<{ name: string }> = gql`
  fragment GetPostPreviewPostTags on PostTag {
    name
  }
`;

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
      mt={2}
      pt={{ md: 2 }}
      borderTop={{ md: "1px solid" }}
      borderColor={{ md: "divider" }}
    >
      {selectedTags}
    </Box>
  );
};

export default PostTagsPreview;
