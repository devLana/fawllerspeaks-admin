import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { BIN_POSTS } from "@mutations/binPosts/BIN_POSTS";
import { SESSION_ID } from "@utils/constants";
import type { BinPostsData } from "types/posts/binPosts";
import type { RefetchQueriesFn } from "@types";

const useBinPost = (postId: string, onCloseDialog: VoidFunction) => {
  const [isBinning, setIsBinning] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, msg: "" });
  const { replace, pathname } = useRouter();

  const [binPosts, { client }] = useMutation(BIN_POSTS);

  const handleResponse = (msg: string) => {
    onCloseDialog();
    setIsBinning(false);
    setToast({ open: true, msg });
  };

  const binPostsFn = (
    update: MutationBaseOptions<BinPostsData>["update"],
    refetchQueries: RefetchQueriesFn<BinPostsData> | undefined = undefined
  ) => {
    const MSG = `You are unable to bin that post right now. Please try again later`;

    setIsBinning(true);

    void binPosts({
      variables: { postIds: [postId] },
      update,
      refetchQueries,
      onError: err => handleResponse(err.graphQLErrors?.[0]?.message ?? MSG),
      onCompleted(binData) {
        switch (binData.binPosts.__typename) {
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

          case "PostIdsValidationError":
            handleResponse(binData.binPosts.postIdsError);
            break;

          case "UnknownError":
          case "PostsWarning":
            handleResponse(binData.binPosts.message);
            break;

          case "Posts":
            handleResponse("Post binned");
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
