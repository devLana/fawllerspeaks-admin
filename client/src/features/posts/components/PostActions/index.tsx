import * as React from "react";

import { type IconButtonProps } from "@mui/material/IconButton";

import useUnpublishPost from "@hooks/unpublishPost/useUnpublishPost";
import useUndoUnpublishPost from "@hooks/undoUnpublishPost/useUndoUnpublishPost";
import useBinPost from "@hooks/binPosts/useBinPost";
import PostMenu from "./PostMenu";
import UnpublishPost from "./UnpublishPost";
import BinPost from "./BinPost";
import type { PostStatus } from "@apiTypes";

interface PostActionsProps {
  id: string;
  title: string;
  status: PostStatus;
  slug: string;
  showTitleInDialog?: boolean;
  toastMessage: string | React.ReactElement;
  menuSx?: IconButtonProps["sx"];
}

const PostActions = (props: PostActionsProps) => {
  const { id, toastMessage, showTitleInDialog = false, ...menuProps } = props;
  const [message, setMessage] = React.useState<string | React.ReactElement>("");
  const [showToast, setShowToast] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);

  const unpublish = useUnpublishPost(id, menuProps.slug, setMessage);
  const undoUnpublish = useUndoUnpublishPost(id, menuProps.slug, setMessage);
  const binPost = useBinPost(id, () => setShowDialog(false));

  const handleUnpublish = () => {
    setMessage(toastMessage);
    setShowToast(true);
  };

  return (
    <>
      <PostMenu
        onUnpublish={handleUnpublish}
        onBinPost={() => setShowDialog(true)}
        disableUnpublish={
          unpublish.status === "loading" || undoUnpublish.isLoading
        }
        {...menuProps}
      />
      <UnpublishPost
        message={message}
        showToast={showToast}
        unpublishStatus={unpublish.status}
        undoUnpublishHasError={undoUnpublish.hasError}
        onCloseToast={() => setShowToast(false)}
        onUnpublish={unpublish.unpublishFn}
        onUndoUnpublish={undoUnpublish.undoUnpublishFn}
        onUnpublished={unpublish.unpublished}
        onUndoneUnpublish={undoUnpublish.undoneUnpublish}
      />
      <BinPost
        showDialog={showDialog}
        toast={binPost.toast}
        title={menuProps.title}
        isBinning={binPost.isBinning}
        isPublished={menuProps.status === "Published"}
        showTitleInDialog={showTitleInDialog}
        onBinPosts={binPost.binPostsFn}
        onCloseDialog={() => setShowDialog(false)}
        onCloseToast={binPost.handleCloseToast}
      />
    </>
  );
};

export default PostActions;
