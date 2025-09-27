import * as React from "react";

import { type IconButtonProps } from "@mui/material/IconButton";

import useUnpublishPost from "@hooks/unpublishPost/useUnpublishPost";
import useUndoUnpublishPost from "@hooks/undoUnpublishPost/useUndoUnpublishPost";
import useBinPost from "@hooks/binPosts/useBinPost";
import PostMenu from "@features/posts/components/PostMenu";
import UnpublishPost from "@features/posts/UnpublishPost";
import BinPost from "@features/posts/BinPost";
import { update as binPostUpdate } from "@cache/update/posts/binPostOnView";
import { update as unPubUpdate } from "@cache/update/posts/unpublishPostOnView";
import { update as undoUnpublishUpdate } from "@cache/update/posts/undoUnpublishPostOnView";
import type { PostStatus } from "@apiTypes";

interface PostActionsProps {
  id: string;
  title: string;
  status: PostStatus;
  slug: string;
  menuSx?: IconButtonProps["sx"];
}

const PostActions = ({ id, ...menuProps }: PostActionsProps) => {
  const [message, setMessage] = React.useState<string | React.ReactElement>("");
  const [showToast, setShowToast] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);

  const unpublish = useUnpublishPost(id, menuProps.slug, setMessage);
  const undoUnpublish = useUndoUnpublishPost(id, menuProps.slug, setMessage);
  const binPost = useBinPost(id, () => setShowDialog(false));

  const handleUnpublish = () => {
    setShowToast(true);
    setMessage(
      "Are you sure you want to Unpublish this post? Un-publishing a post will de-list it from the blog website"
    );
  };

  const unpublishUpdate = unPubUpdate(menuProps.slug);
  const undoUnPubUpdate = undoUnpublishUpdate(menuProps.slug);

  return (
    <>
      <PostMenu
        {...menuProps}
        onUnpublish={handleUnpublish}
        onBinPost={() => setShowDialog(true)}
        disableUnpublish={
          unpublish.status === "loading" || undoUnpublish.isLoading
        }
      />
      <UnpublishPost
        message={message}
        showToast={showToast}
        unpublishStatus={unpublish.status}
        undoUnpublishHasError={undoUnpublish.hasError}
        onCloseToast={() => setShowToast(false)}
        onUnpublish={() => unpublish.unpublishFn(unpublishUpdate)}
        onUndoUnpublish={() => undoUnpublish.undoUnpublishFn(undoUnPubUpdate)}
        onUnpublished={unpublish.unpublished}
        onUndoneUnpublish={undoUnpublish.undoneUnpublish}
      />
      <BinPost
        showDialog={showDialog}
        toast={binPost.toast}
        title={menuProps.title}
        isBinning={binPost.isBinning}
        isPublished={menuProps.status === "Published"}
        onBinPosts={() => binPost.binPostsFn(binPostUpdate)}
        onCloseDialog={() => setShowDialog(false)}
        onCloseToast={binPost.handleCloseToast}
      />
    </>
  );
};

export default PostActions;
