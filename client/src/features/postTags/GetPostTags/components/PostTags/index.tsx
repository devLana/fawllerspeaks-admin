import * as React from "react";

import Alert from "@mui/material/Alert";

import ErrorBoundary from "@components/ErrorBoundary";
import EditPostTag from "@features/postTags/EditPostTag";
import DeletePostTags from "@features/postTags/DeletePostTags";
import PostTagsWrapper from "../PostTagsWrapper";
import PostTagsList from "./components/PostTagsList";
import type { PostTagData } from "@types";

interface SelectedTags {
  name: string;
  tagsMap: Record<string, string>;
  tagIds: string[];
}

const PostTags = ({ id: titleId }: { id: string }) => {
  const [edit, setEdit] = React.useState({ open: false, name: "", id: "" });
  const [deleteTags, setDeleteTags] = React.useState(false);
  const [tagToDelete, setTagToDelete] = React.useState({ name: "", id: "" });

  const [selectedTags, setSelectedTags] = React.useState<SelectedTags>({
    name: "",
    tagIds: [],
    tagsMap: {},
  });

  const handleMenuEdit = React.useCallback((name: string, id: string) => {
    setEdit({ open: true, name, id });
  }, []);

  const handleMenuDelete = React.useCallback((name: string, id: string) => {
    setDeleteTags(true);
    setTagToDelete({ name, id });
  }, []);

  const handleTagCheckbox = React.useCallback(
    (checked: boolean, id: string, name: string) => {
      setSelectedTags(prevState => {
        const data: SelectedTags = { name: "", tagIds: [], tagsMap: {} };

        if (checked) {
          data.name = prevState.name || name;
          data.tagIds = [...prevState.tagIds, id];
          data.tagsMap = { ...prevState.tagsMap, [id]: name };
        } else {
          const { tagsMap, tagIds, name: tagName } = prevState;
          data.name = tagName;

          if (tagName === name) {
            data.name = tagIds.length > 1 ? tagsMap[tagIds[1]] : "";
          }

          for (const tagId in tagsMap) {
            if (tagId === id) continue;

            data.tagIds.push(tagId);
            data.tagsMap[tagId] = tagsMap[tagId];
          }
        }

        return data;
      });
    },
    []
  );

  const handleToolbarDeleteButton = () => setDeleteTags(true);
  const handleCloseDeleteModal = () => setDeleteTags(false);

  const handleClearMenuDeleteSelection = () => {
    setTagToDelete({ id: "", name: "" });
  };

  const handleAllCheckbox = (checked: boolean, cachedTags: PostTagData[]) => {
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

  const handleClearCheckboxSelections = (deletedTags?: string[]) => {
    const data: SelectedTags = { name: "", tagIds: [], tagsMap: {} };

    if (deletedTags) {
      const deletedTagIdsSet = new Set(deletedTags);

      selectedTags.tagIds.forEach(tagId => {
        if (!deletedTagIdsSet.has(tagId)) {
          data.tagIds.push(tagId);
          data.tagsMap[tagId] = selectedTags.tagsMap[tagId];
        }
      });

      const [firstId] = data.tagIds;
      data.name = data.tagsMap[firstId] || "";
    }

    setSelectedTags(data);
  };

  const msg =
    "There was an error trying to display the list of post tags. Please try again later";

  const alertProps = { severity: "error", "aria-busy": false } as const;
  const name = tagToDelete.name || selectedTags.name;
  const ids = tagToDelete.id ? [tagToDelete.id] : selectedTags.tagIds;

  return (
    <>
      <PostTagsWrapper id={titleId}>
        <ErrorBoundary fallback={<Alert {...alertProps}>{msg}</Alert>}>
          <PostTagsList
            selectedTagsMap={selectedTags.tagsMap}
            selectedTagIdsLength={selectedTags.tagIds.length}
            onClickMenuEdit={handleMenuEdit}
            onClickToolbarDeleteButton={handleToolbarDeleteButton}
            onClickMenuDelete={handleMenuDelete}
            onTagCheckboxChange={handleTagCheckbox}
            onAllCheckboxChange={handleAllCheckbox}
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
        onCloseDelete={handleCloseDeleteModal}
        onClearMenuDeleteSelection={handleClearMenuDeleteSelection}
        onClearCheckboxSelections={handleClearCheckboxSelections}
      />
    </>
  );
};

export default PostTags;
