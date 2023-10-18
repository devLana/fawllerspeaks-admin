import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";

import PostTagsWrapper from "../PostTagsWrapper";
import PostTagMenu from "./TagMenu";
import type { PostTag } from "@apiTypes";

const Tags = ({ tags, id }: { tags: PostTag[]; id: string }) => (
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
            direction="row"
            alignItems="center"
            columnGap={1}
            sx={{ "&:hover>.MuiIconButton-root": { opacity: 1 } }}
          >
            <Chip label={name} />
            <PostTagMenu name={name} />
          </Stack>
        </Grid>
      ))}
    </Grid>
  </PostTagsWrapper>
);

export default Tags;
