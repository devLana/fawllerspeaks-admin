import * as React from "react";

import useUnpublishPost from "./unpublishPost/useUnpublishPost";
import useUndoUnpublishPost from "./undoUnpublishPost/useUndoUnpublishPost";
import useBinPost from "./binPosts/useBinPost";

const usePostActions = (id: string, slug: string) => {
  const [message, setMessage] = React.useState<string | React.ReactElement>("");
  const [showToast, setShowToast] = React.useState(false);
  const [showDialog, setShowDialog] = React.useState(false);

  const unpublish = useUnpublishPost(id, slug, setMessage);
  const undoUnpublish = useUndoUnpublishPost(id, slug, setMessage);
  const binPost = useBinPost(id, () => setShowDialog(false));

  return {
    message,
    showToast,
    showDialog,
    setMessage,
    setShowToast,
    setShowDialog,
    unpublish,
    undoUnpublish,
    binPost,
  };
};

export default usePostActions;
