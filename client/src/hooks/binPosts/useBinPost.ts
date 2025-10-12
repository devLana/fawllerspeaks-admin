import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { BIN_POST } from "@mutations/binPost/BIN_POST";
import { SESSION_ID } from "@utils/constants";
import type { BinPostData } from "types/posts/bin/binPost";
import type { RefetchQueriesFn } from "@types";

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
    update: MutationBaseOptions<BinPostData>["update"],
    refetchQueries: RefetchQueriesFn<BinPostData> | undefined = undefined,
    unselectPost?: (postId: string) => void
  ) => {
    const MSG = `You are unable to bin that post right now. Please try again later`;

    setIsBinning(true);

    void binPost({
      variables: { postId },
      update,
      refetchQueries,
      onError: err => handleResponse(err.graphQLErrors?.[0]?.message ?? MSG),
      onCompleted(binData) {
        switch (binData.binPost.__typename) {
          case "AuthenticationError": {
            const query = { status: "unauthenticated", redirectTo: pathname };

            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace({ pathname: "/login", query });
            break;
          }

          case "RegistrationError": {
            const query = { status: "unregistered", redirectTo: pathname };
            void replace({ pathname: "/register", query });
            break;
          }

          case "NotAllowedError": {
            const query = { status: "unauthorized" };

            localStorage.removeItem(SESSION_ID);
            void client.clearStore();
            void replace({ pathname: "/login", query });
            break;
          }

          case "PostIdValidationError":
            handleResponse(binData.binPost.postIdError);
            break;

          case "UnknownError":
          case "NotAllowedPostActionError":
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

  const handleCloseToast = () => setToast({ ...toast, open: false });

  return { isBinning, toast, handleCloseToast, binPostsFn };
};

export default useBinPost;
