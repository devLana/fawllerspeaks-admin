import * as React from "react";

import { useApolloClient } from "@apollo/client";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";

import TagMenu from "./TagMenu";
import { GET_CACHED_POST_TAGS } from "../../operations/GET_CACHED_POST_TAGS";

interface TagsListProps {
  onOpenEdit: (name: string, tagId: string) => void;
}

const TagsList = ({ onOpenEdit }: TagsListProps) => {
  const client = useApolloClient();

  const cachedTags = client.readQuery({ query: GET_CACHED_POST_TAGS });

  const tagsList = React.useMemo(() => {
    return cachedTags?.getPostTags.tags.map(({ id, name }) => (
      <Grid
        key={id}
        component={ListItem}
        disableGutters
        item
        xs={6}
        sm={4}
        md={3}
        lg={2}
      >
        <Stack
          aria-label={`${name} post tag container`}
          direction="row"
          alignItems="center"
          columnGap={1}
          sx={{ "&:hover>.MuiIconButton-root": { opacity: 1 } }}
        >
          <Chip label={name} />
          <TagMenu name={name} id={id} onOpenEdit={onOpenEdit} />
        </Stack>
      </Grid>
    ));
  }, [cachedTags?.getPostTags.tags, onOpenEdit]);

  return (
    <Grid
      aria-busy={false}
      component={List}
      container
      rowSpacing={2.5}
      columnSpacing={2}
    >
      {tagsList}
    </Grid>
  );
};

export default TagsList;
