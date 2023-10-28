import * as React from "react";

import PostTagsWrapper from "../PostTagsWrapper";
import TagsList from "./TagsList";
import EditPostTag from "@features/postTags/EditPostTag";

const Tags = ({ id: titleId }: { id: string }) => {
  const [edit, setEdit] = React.useState({ open: false, name: "", id: "" });

  const handleOpenEdit = React.useCallback((name: string, tagId: string) => {
    setEdit({ open: true, name, id: tagId });
  }, []);

  return (
    <>
      <PostTagsWrapper id={titleId}>
        <TagsList onOpenEdit={handleOpenEdit} />
      </PostTagsWrapper>
      <EditPostTag
        {...edit}
        onCloseEdit={() => setEdit({ open: false, name: "", id: "" })}
      />
    </>
  );
};

export default Tags;
