import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import Stack from "@mui/material/Stack";

interface PostTagProps {
  id: string;
  name: string;
  idName: string;
  tagsMap: Record<string, string>;
  postTagMenu: React.ReactElement;
  onSelectOne: (checked: boolean, id: string, name: string) => void;
}

const PostTag = (props: PostTagProps) => {
  const { id, name, idName, tagsMap, postTagMenu, onSelectOne } = props;

  return (
    <Grid component={ListItem} disableGutters item xs={6} md={4} lg={3}>
      <Stack
        aria-label={`${name} post tag container`}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        columnGap={1}
        width="100%"
        sx={{ "&:hover>.MuiIconButton-root": { opacity: 1 } }}
      >
        <FormControlLabel
          control={
            <Checkbox
              id={`${idName}-checkbox`}
              size="small"
              onChange={e => onSelectOne(e.target.checked, id, name)}
              checked={!!tagsMap[id]}
            />
          }
          label={name}
          sx={{
            mr: 0,
            width: "80%",
            columnGap: 0.25,
            "&>.MuiFormControlLabel-label": {
              textOverflow: "ellipsis",
              lineHeight: 1,
              fontSize: "0.85em",
              p: 1.25,
              borderRadius: 3,
              border: 1,
              borderColor: tagsMap[id] ? "inherit" : "transparent",
              overflow: "hidden",
              whiteSpace: "nowrap",
              bgcolor: "action.selected",
              userSelect: "none",
            },
          }}
        />
        {postTagMenu}
      </Stack>
    </Grid>
  );
};

export default PostTag;
