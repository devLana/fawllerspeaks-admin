import * as React from "react";

import { useApolloClient } from "@apollo/client";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";

import PostTagsToolbar from "./PostTagsToolbar";
import PostTag from "./PostTag";
import { GET_CACHED_POST_TAGS } from "../../../operations/GET_CACHED_POST_TAGS";
import type { PostTagData } from "@types";

interface PostTagsListProps {
  selectedTagsMap: Record<string, string>;
  selectedTagIdsLength: number;
  onClickMenuEdit: (name: string, tagId: string) => void;
  onClickToolbarDeleteButton: () => void;
  onClickMenuDelete: (name: string, id: string) => void;
  onTagCheckboxChange: (checked: boolean, id: string, name: string) => void;
  onAllCheckboxChange: (value: boolean, cachedTags: PostTagData[]) => void;
}

const PostTagsList = ({
  selectedTagsMap,
  selectedTagIdsLength,
  onClickMenuEdit,
  onClickToolbarDeleteButton,
  onClickMenuDelete,
  onTagCheckboxChange,
  onAllCheckboxChange,
}: PostTagsListProps) => {
  const client = useApolloClient();
  const cachedTags = client.readQuery({ query: GET_CACHED_POST_TAGS });

  if (!cachedTags) throw new Error();

  const { tags } = cachedTags.getPostTags;

  const tagsList = React.useMemo(() => {
    return tags.map(({ id, name }) => {
      const idName = name.replace(/[\s_.]/g, "-");

      return (
        <PostTag
          key={id}
          id={id}
          idName={idName}
          name={name}
          isChecked={!!selectedTagsMap[id]}
          onTagCheckboxChange={onTagCheckboxChange}
          onClickMenuEdit={onClickMenuEdit}
          onClickMenuDelete={onClickMenuDelete}
        />
      );
    });
  }, [
    tags,
    selectedTagsMap,
    onClickMenuEdit,
    onClickMenuDelete,
    onTagCheckboxChange,
  ]);

  return (
    <div aria-busy={false}>
      <PostTagsToolbar
        numberOfSelectedPostTags={selectedTagIdsLength}
        totalNumberOfPostTags={tags.length}
        onAllCheckboxChange={value => onAllCheckboxChange(value, tags)}
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
