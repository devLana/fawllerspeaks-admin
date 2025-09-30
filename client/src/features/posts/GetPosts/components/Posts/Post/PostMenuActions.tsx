import Typography from "@mui/material/Typography";
import { type IconButtonProps } from "@mui/material/IconButton";

import { usePostsFilters } from "@hooks/getPosts/usePostsFilters";
import usePostActions from "@hooks/usePostActions";
import PostMenu from "@features/posts/components/PostMenu";
import UnpublishPost from "@features/posts/UnpublishPost";
import BinPost from "@features/posts/BinPost";
import { update as binPostUpdate } from "@cache/update/posts/binPostOnPosts";
import { refetchQueries as binPostRefetch } from "@cache/refetchQueries/posts/binPostOnPosts";
import { update as unPubUpdate } from "@cache/update/posts/unpublishPostOnPosts";
import { refetchQueries as unPubRefetch } from "@cache/refetchQueries/posts/unpublishPostOnPosts";
import { update as undoUnPubUpdateCache } from "@cache/update/posts/undoUnpublishPostOnPosts";
import { refetchQueries as undoUnPubRefetchQUeries } from "@cache/refetchQueries/posts/undoUnpublishPostOnPosts";
import type { PostStatus } from "@apiTypes";

interface PostMenuActionsProps {
  id: string;
  title: string;
  status: PostStatus;
  slug: string;
  menuSx?: IconButtonProps["sx"];
}

const PostMenuActions = ({ id, ...menuProps }: PostMenuActionsProps) => {
  const { gqlVariables } = usePostsFilters();

  const {
    message,
    showToast,
    showDialog,
    setMessage,
    setShowToast,
    setShowDialog,
    unpublish,
    undoUnpublish,
    binPost,
  } = usePostActions(id, menuProps.slug);

  const binPostUpdateCache = binPostUpdate(gqlVariables);
  const binPostRefetchQUeries = binPostRefetch(gqlVariables);
  const unPubUpdateCache = unPubUpdate(gqlVariables);
  const unPubRefetchQueries = unPubRefetch(gqlVariables);
  const undoUnPubUpdate = undoUnPubUpdateCache(gqlVariables);
  const undoUnPubRefetch = undoUnPubRefetchQUeries(gqlVariables);

  const handleUnpublish = () => {
    setShowToast(true);
    setMessage(
      <>
        Are you sure you want to unpublish{" "}
        <Typography component="span" sx={{ fontWeight: "bold" }}>
          {menuProps.title}
        </Typography>
        ? Unpublishing this post will de-list it from the blog website
      </>
    );
  };

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
        onUnpublish={() =>
          unpublish.unpublishFn(unPubUpdateCache, unPubRefetchQueries)
        }
        onUndoUnpublish={() =>
          undoUnpublish.undoUnpublishFn(undoUnPubUpdate, undoUnPubRefetch)
        }
        onUnpublished={unpublish.unpublished}
        onUndoneUnpublish={undoUnpublish.undoneUnpublish}
      />
      <BinPost
        showDialog={showDialog}
        toast={binPost.toast}
        title={menuProps.title}
        isBinning={binPost.isBinning}
        isPublished={menuProps.status === "Published"}
        showTitleInDialog
        onBinPosts={() =>
          binPost.binPostsFn(binPostUpdateCache, binPostRefetchQUeries)
        }
        onCloseDialog={() => setShowDialog(false)}
        onCloseToast={binPost.handleCloseToast}
      />
    </>
  );
};

export default PostMenuActions;
