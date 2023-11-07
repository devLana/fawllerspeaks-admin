import * as React from "react";

import Alert from "@mui/material/Alert";

import ErrorBoundary from "@components/ErrorBoundary";
import EditPostTag from "@features/postTags/EditPostTag";
import DeletePostTags from "@features/postTags/DeletePostTags";
import PostTagsWrapper from "../PostTagsWrapper";
import PostTagsList from "./components/PostTagsList";
import type { PostTag } from "@apiTypes";

interface SelectedTags {
  name: string;
  tagsMap: Record<string, string>;
  tagIds: string[];
}

const PostTags = ({ id: titleId }: { id: string }) => {
  const [edit, setEdit] = React.useState({ open: false, name: "", id: "" });
  const [deleteTags, setDeleteTags] = React.useState(false);

  const [selectedTags, setSelectedTags] = React.useState<SelectedTags>({
    name: "",
    tagIds: [],
    tagsMap: {},
  });

  const [menuSelectedTag, setMenuSelectedTag] = React.useState({
    name: "",
    id: "",
  });

  const handleOpenEdit = React.useCallback((name: string, tagId: string) => {
    setEdit({ open: true, name, id: tagId });
  }, []);

  const handleClickDeleteButton = () => setDeleteTags(true);

  const handleClickDeleteMenu = React.useCallback(
    (name: string, id: string) => {
      setDeleteTags(true);
      setMenuSelectedTag({ name, id });
    },
    []
  );

  const handleCloseDelete = () => {
    setDeleteTags(false);
    setMenuSelectedTag({ id: "", name: "" });
  };

  const handleSelectOne = React.useCallback(
    (checked: boolean, id: string, name: string) => {
      const data: SelectedTags = { name: "", tagIds: [], tagsMap: {} };

      if (checked) {
        data.name = selectedTags.name || name;
        data.tagIds = [...selectedTags.tagIds, id];
        data.tagsMap = { ...selectedTags.tagsMap, [id]: name };
      } else {
        const { tagsMap, tagIds } = selectedTags;
        data.name = selectedTags.name;

        if (selectedTags.name === name) {
          data.name = tagIds.length > 1 ? tagsMap[tagIds[1]] : "";
        }

        for (const tagId in tagsMap) {
          if (tagId === id) continue;

          data.tagIds.push(tagId);
          data.tagsMap[tagId] = tagsMap[tagId];
        }
      }

      setSelectedTags(data);
    },
    [selectedTags]
  );

  const handleSelectAll = (checked: boolean, cachedTags: PostTag[]) => {
    const data: SelectedTags = { name: "", tagIds: [], tagsMap: {} };

    if (checked) {
      cachedTags.forEach((tag, index) => {
        if (index === 0) data.name = tag.name;
        data.tagsMap[tag.id] = tag.name;
        data.tagIds.push(tag.id);
      });
    }

    setSelectedTags(data);
  };

  const handleClearSelection = (deletedTags?: PostTag[]) => {
    const data: SelectedTags = { name: "", tagIds: [], tagsMap: {} };

    if (deletedTags) {
      const deletedTagsIds = new Set<string>();

      deletedTags.forEach(tag => {
        deletedTagsIds.add(tag.id);
      });

      selectedTags.tagIds.forEach(tagId => {
        if (!deletedTagsIds.has(tagId)) {
          data.tagIds.push(tagId);
          data.tagsMap[tagId] = selectedTags.tagsMap[tagId];
        }
      });

      const [firstId] = data.tagIds;
      data.name = firstId ? data.tagsMap[firstId] : "";
    }

    setSelectedTags(data);
  };

  const msg =
    "There was an error trying to display the list of post tags. Please try again later";
  const alertProps = { severity: "error", "aria-busy": false } as const;
  const name = menuSelectedTag.name || selectedTags.name;
  const ids = menuSelectedTag.id ? [menuSelectedTag.id] : selectedTags.tagIds;

  return (
    <>
      <PostTagsWrapper id={titleId}>
        <ErrorBoundary fallback={<Alert {...alertProps}>{msg}</Alert>}>
          <PostTagsList
            selectedTagsMap={selectedTags.tagsMap}
            selectedTagIdsLength={selectedTags.tagIds.length}
            onOpenEdit={handleOpenEdit}
            onClickDeleteButton={handleClickDeleteButton}
            onClickDeleteMenu={handleClickDeleteMenu}
            onSelectOne={handleSelectOne}
            onSelectAll={handleSelectAll}
          />
        </ErrorBoundary>
      </PostTagsWrapper>
      <EditPostTag
        {...edit}
        onCloseEdit={() => setEdit({ open: false, name: "", id: "" })}
      />
      <DeletePostTags
        open={deleteTags}
        name={name}
        ids={ids}
        onCloseDelete={handleCloseDelete}
        onClearSelection={handleClearSelection}
      />
    </>
  );
};

export default PostTags;
