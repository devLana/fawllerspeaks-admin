import * as React from "react";

import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";

import PostTagsWrapper from "../PostTagsWrapper";
import TagMenu from "./TagMenu";
import EditPostTag from "../../../EditPostTag";
import { handleCloseAlert } from "@utils/handleCloseAlert";
import type { PostTag } from "@apiTypes";

interface Edit {
  open: boolean;
  name: string;
  id: string;
}

const Tags = ({ tags, id }: { tags: PostTag[]; id: string }) => {
  const [alert, setAlert] = React.useState({ open: false, message: "" });
  const [edit, setEdit] = React.useState<Edit>({
    open: false,
    name: "",
    id: "",
  });

  const handleAlertClose = handleCloseAlert<typeof alert>(
    { open: false, message: "" },
    setAlert
  );

  const handleEdit = (tagName: string, tagId: string) => {
    setEdit({ open: true, name: tagName, id: tagId });
  };

  return (
    <>
      <PostTagsWrapper id={id}>
        <Grid component={List} container rowSpacing={2.5} columnSpacing={2}>
          {tags.map(({ id: tagId, name }) => (
            <Grid
              key={tagId}
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
                <TagMenu
                  tagName={name}
                  tagId={tagId}
                  onEditPostTag={handleEdit}
                />
              </Stack>
            </Grid>
          ))}
        </Grid>
      </PostTagsWrapper>
      <EditPostTag
        {...edit}
        onCloseDialog={() => setEdit({ open: false, name: "", id: "" })}
        onOpenAlert={(message: string) => setAlert({ message, open: true })}
      />
      <Snackbar
        message={alert.message}
        open={alert.open}
        onClose={handleAlertClose}
      />
    </>
  );
};

export default Tags;
