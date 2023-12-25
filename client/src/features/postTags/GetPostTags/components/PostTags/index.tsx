import * as React from "react";

import Alert from "@mui/material/Alert";

import ErrorBoundary from "@components/ErrorBoundary";
import EditPostTag from "@features/postTags/EditPostTag";
import DeletePostTags from "@features/postTags/DeletePostTags";
import PostTagsWrapper from "../PostTagsWrapper";
import PostTagsList from "./components/PostTagsList";
import type { PostTagData } from "@types";

type SelectedTags = Record<string, string>;

interface DeleteTag {
  open: boolean;
  name: string;
  ids: string[];
}

const PostTags = ({ id: titleId }: { id: string }) => {
  const [edit, setEdit] = React.useState({ open: false, name: "", id: "" });
  const [deleteTags, setDeleteTags] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<SelectedTags>({});

  const [deleteTag, setDeleteTag] = React.useState<DeleteTag>({
    open: false,
    name: "",
    ids: [],
  });

  const handleMenuEdit = React.useCallback((name: string, id: string) => {
    setEdit({ open: true, name, id });
  }, []);

  const handleMenuDelete = React.useCallback((name: string, id: string) => {
    setDeleteTag({ open: true, name, ids: [id] });
  }, []);

  const handleTagCheckbox = React.useCallback(
    (checked: boolean, tagId: string, tagName: string) => {
      setSelectedTags(prevState => {
        if (checked) return { ...prevState, [tagId]: tagName };

        const { [tagId]: _, ...rest } = prevState;
        return rest;
      });
    },
    []
  );

  const handleAllCheckbox = (checked: boolean, tags: PostTagData[]) => {
    const data: SelectedTags = {};

    if (checked) {
      tags.forEach(tag => {
        data[tag.id] = tag.name;
      });
    }

    setSelectedTags(data);
  };

  const handleClearSelection = (deletedTags?: string[]) => {
    if (!deletedTags) return setSelectedTags({});

    let data = selectedTags;

    deletedTags.forEach(deletedTag => {
      const { [deletedTag]: _, ...rest } = data;
      data = rest;
    });

    return setSelectedTags(data);
  };

  const handleEdited = (name: string, id: string) => {
    if (selectedTags[id]) {
      selectedTags[id] = name;
      setSelectedTags(selectedTags);
    }
  };

  const msg =
    "There was an error trying to display the list of post tags. Please try again later";

  const alertProps = { severity: "error", "aria-busy": false } as const;
  const selectedTagsIds = Object.keys(selectedTags);

  return (
    <>
      <PostTagsWrapper id={titleId}>
        <ErrorBoundary fallback={<Alert {...alertProps}>{msg}</Alert>}>
          <PostTagsList
            selectedTags={selectedTags}
            tagIdsLength={selectedTagsIds.length}
            setSelectedTags={setSelectedTags}
            onClickMenuEdit={handleMenuEdit}
            onClickMenuDelete={handleMenuDelete}
            onTagCheckboxChange={handleTagCheckbox}
            onAllCheckboxChange={handleAllCheckbox}
            onClickToolbarDeleteButton={() => setDeleteTags(true)}
          />
        </ErrorBoundary>
      </PostTagsWrapper>
      <EditPostTag
        {...edit}
        onEdit={handleEdited}
        onCloseEdit={() => setEdit({ open: false, name: "", id: "" })}
      />
      {/* Delete a post tag by clicking delete on the post tag's menu */}
      <DeletePostTags
        {...deleteTag}
        onCloseDelete={() => setDeleteTag({ open: false, name: "", ids: [] })}
        onClearSelection={handleClearSelection}
      />
      {/* Delete multiple post tag(s) by selecting the post tags and clicking the toolbar delete button */}
      <DeletePostTags
        open={deleteTags}
        name={selectedTags[selectedTagsIds[0]]}
        ids={selectedTagsIds}
        onCloseDelete={() => setDeleteTags(false)}
        onClearSelection={handleClearSelection}
      />
    </>
  );
};

export default PostTags;
