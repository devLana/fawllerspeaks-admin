import * as React from "react";

import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";

import { useGetCachePostTags } from "@features/postTags/hooks/useGetCachePostTags";
import PostTagsToolbar from "./PostTagsToolbar";
import PostTag from "./PostTag";
import type { PostTagData, StateSetterFn } from "@types";

interface PostTagsListProps {
  selectedTags: Record<string, string>;
  setSelectedTags: StateSetterFn<Record<string, string>>;
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
  setSelectedTags,
  onClickMenuEdit,
  onClickMenuDelete,
  onTagCheckboxChange,
  onAllCheckboxChange,
  onClickToolbarDeleteButton,
}: PostTagsListProps) => {
  const anchorTag = React.useRef<string | null>(null);
  const cachedTags = useGetCachePostTags();

  if (!cachedTags) throw new Error();

  const handleShiftClick = React.useCallback(
    (shiftKey: boolean, id: string) => {
      if (!shiftKey) {
        anchorTag.current = id;
        return;
      }

      if (anchorTag.current && anchorTag.current !== id) {
        const indexes: number[] = [];
        const anchorTagId = anchorTag.current;

        for (let i = 0; i < cachedTags.length; i++) {
          const { id: tagId } = cachedTags[i];

          if (tagId === anchorTagId || tagId === id) {
            indexes.push(i);

            if (indexes.length === 2) {
              indexes.sort((a, b) => a - b);
              break;
            }
          }
        }

        const [start, end] = indexes;

        setSelectedTags(prevState => {
          const data = prevState;

          if (prevState[anchorTagId]) {
            for (let i = start; i <= end; i++) {
              data[cachedTags[i].id] = cachedTags[i].name;
            }
          } else {
            for (let i = start; i <= end; i++) {
              // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
              delete data[cachedTags[i].id];
            }
          }

          return data;
        });
      }
    },
    [cachedTags, setSelectedTags]
  );

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
        onClickLabel={handleShiftClick}
      />
    ));
  }, [
    cachedTags,
    selectedTags,
    handleShiftClick,
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
