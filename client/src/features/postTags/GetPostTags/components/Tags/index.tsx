import * as React from "react";

import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";

import TagMenu from "./TagMenu";
import PostTagsWrapper from "../PostTagsWrapper";
import EditPostTag from "@features/postTags/EditPostTag";
import type { PostTag } from "@apiTypes";

const Tags = ({ tags, id: titleId }: { tags: PostTag[]; id: string }) => {
  const [edit, setEdit] = React.useState({ open: false, name: "", id: "" });

  const handleOpenEdit = (name: string, tagId: string) => {
    setEdit({ open: true, name, id: tagId });
  };

  const mappedTags = React.useMemo(() => {
    return tags.map(({ id, name }) => (
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
          <TagMenu name={name} id={id} onOpenEdit={handleOpenEdit} />
        </Stack>
      </Grid>
    ));
  }, [tags]);

  return (
    <>
      <PostTagsWrapper id={titleId}>
        <Grid
          aria-busy={false}
          component={List}
          container
          rowSpacing={2.5}
          columnSpacing={2}
        >
          {mappedTags}
        </Grid>
      </PostTagsWrapper>
      <EditPostTag
        {...edit}
        onCloseEdit={() => setEdit({ open: false, name: "", id: "" })}
      />
    </>
  );
};

export default Tags;
