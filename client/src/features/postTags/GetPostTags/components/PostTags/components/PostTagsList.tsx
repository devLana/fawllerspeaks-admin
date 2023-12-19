import * as React from "react";

import { useApolloClient } from "@apollo/client";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";

import PostTagsToolbar from "./PostTagsToolbar";
import PostTag from "./PostTag";
import PostTagMenu from "./PostTagMenu";
import { GET_CACHED_POST_TAGS } from "@features/postTags/GetPostTags/operations/GET_CACHED_POST_TAGS";
import type { PostTagData } from "@types";

interface PostTagsListProps {
  selectedTagsMap: Record<string, string>;
  selectedTagIdsLength: number;
  onOpenEdit: (name: string, tagId: string) => void;
  onClickDeleteButton: () => void;
  onClickDeleteMenu: (name: string, id: string) => void;
  onSelectOne: (checked: boolean, id: string, name: string) => void;
  onSelectAll: (value: boolean, cachedTags: PostTagData[]) => void;
}

const PostTagsList = ({
  selectedTagsMap,
  selectedTagIdsLength,
  onOpenEdit,
  onClickDeleteButton,
  onClickDeleteMenu,
  onSelectOne,
  onSelectAll,
}: PostTagsListProps) => {
  const client = useApolloClient();
  const cachedTags = client.readQuery({ query: GET_CACHED_POST_TAGS });

  if (!cachedTags) throw new Error();

  const tagsList = React.useMemo(() => {
    return cachedTags.getPostTags.tags.map(({ id, name }) => {
      const idName = name.replace(/[\s_.]/g, "-");

      return (
        <PostTag
          key={id}
          id={id}
          idName={idName}
          name={name}
          tagsMap={selectedTagsMap}
          onSelectOne={onSelectOne}
          postTagMenu={
            <PostTagMenu
              name={name}
              id={id}
              idName={idName}
              onOpenEdit={onOpenEdit}
              onOpenDelete={onClickDeleteMenu}
            />
          }
        />
      );
    });
  }, [
    cachedTags.getPostTags.tags,
    selectedTagsMap,
    onOpenEdit,
    onClickDeleteMenu,
    onSelectOne,
  ]);

  return (
    <div aria-busy={false}>
      <PostTagsToolbar
        numberOfSelectedPostTags={selectedTagIdsLength}
        totalNumberOfPostTags={cachedTags.getPostTags.tags.length}
        onSelectAll={value => onSelectAll(value, cachedTags.getPostTags.tags)}
        onClick={onClickDeleteButton}
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
