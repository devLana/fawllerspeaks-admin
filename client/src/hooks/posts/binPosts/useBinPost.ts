import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client/react";

import { BIN_POST } from "@mutations/posts/BIN_POST";
import type { BinPostData } from "@appTypes/posts/bin/binPost";
import type { RefetchQueriesFn } from "@appTypes";

const useBinPost = (postId: string, onCloseDialog: VoidFunction) => {
  const [isBinning, setIsBinning] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, msg: "" });
  const { replace, pathname } = useRouter();

  const [binPost, { client }] = useMutation(BIN_POST);

  const handleResponse = (msg: string) => {
    onCloseDialog();
    setIsBinning(false);
    setToast({ open: true, msg });
  };

  const binPostsFn = (
    update: useMutation.Options<BinPostData>["update"],
    refetchQueries?: RefetchQueriesFn<BinPostData>,
    unselectPost?: (postId: string) => void,
  ) => {
    const MSG = `You are unable to bin that post right now. Please try again later`;

    setIsBinning(true);

    void binPost({
      variables: { postId },
      update,
      refetchQueries,
      onError: err => {
        handleResponse(err.graphQLErrors?.[0]?.message ?? MSG);
      },
      onCompleted(binData) {
        switch (binData.binPost.__typename) {
          case "UnauthorizedError": {
            const query = { status: "unauthorized", redirectTo: pathname };

            void client.clearStore();
            void replace({ pathname: "/login", query });
            break;
          }

          case "RegistrationError": {
            const query = { status: "unregistered", redirectTo: pathname };
            void replace({ pathname: "/register", query });
            break;
          }

          case "PostIdValidationError":
            handleResponse(binData.binPost.postIdError);
            break;

          case "NotFoundError":
          case "ForbiddenError":
            handleResponse(binData.binPost.message);
            break;

          case "SinglePost":
            handleResponse("Post binned");
            unselectPost?.(binData.binPost.post.id);
            break;

          default:
            handleResponse(MSG);
        }
      },
    });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  return { isBinning, toast, handleCloseToast, binPostsFn };
};

export default useBinPost;
