import * as React from "react";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";

import PostTagsToolbar from "./PostTagsToolbar";
import PostTag from "./PostTag";
import type { PostTagData } from "@types";
import { useGetCachePostTags } from "@features/postTags/hooks/useGetCachePostTags";

interface PostTagsListProps {
  selectedTags: Record<string, string>;
  tagIdsLength: number;
  onClickMenuEdit: (name: string, tagId: string) => void;
  onClickToolbarDeleteButton: () => void;
  onClickMenuDelete: (name: string, id: string) => void;
  onTagCheckboxChange: (checked: boolean, id: string, name: string) => void;
  onAllCheckboxChange: (value: boolean, cachedTags: PostTagData[]) => void;
}

const PostTagsList = ({
  selectedTags,
  tagIdsLength,
  onClickMenuEdit,
  onClickMenuDelete,
  onTagCheckboxChange,
  onAllCheckboxChange,
  onClickToolbarDeleteButton,
}: PostTagsListProps) => {
  const cachedTags = useGetCachePostTags();

  if (!cachedTags) throw new Error();

  const tagsList = React.useMemo(() => {
    return cachedTags.map(({ id, name }) => (
      <PostTag
        key={id}
        id={id}
        name={name}
        isChecked={!!selectedTags[id]}
        onTagCheckboxChange={onTagCheckboxChange}
        onClickMenuEdit={onClickMenuEdit}
        onClickMenuDelete={onClickMenuDelete}
      />
    ));
  }, [
    cachedTags,
    selectedTags,
    onClickMenuEdit,
    onClickMenuDelete,
    onTagCheckboxChange,
  ]);

  return (
    <div aria-busy={false}>
      <PostTagsToolbar
        numberOfSelectedPostTags={tagIdsLength}
        totalNumberOfPostTags={cachedTags.length}
        onAllCheckboxChange={value => onAllCheckboxChange(value, cachedTags)}
        onClick={onClickToolbarDeleteButton}
      />
      <Divider sx={{ mt: 1, mb: 3.5 }} />
      <Grid
        component={List}
        container
        rowSpacing={2.5}
        columnSpacing={{ xs: 2, sm: 4 }}
      >
        {tagsList}
      </Grid>
    </div>
  );
};

export default PostTagsList;
