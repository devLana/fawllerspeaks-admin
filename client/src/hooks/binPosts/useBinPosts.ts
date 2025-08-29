import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import { BIN_POSTS } from "@mutations/binPosts/BIN_POSTS";
import { SESSION_ID } from "@utils/constants";

const useBinPosts = (
  postIds: string[],
  postOrPosts: string,
  onCloseDialog: VoidFunction
) => {
  const [isBinning, setIsBinning] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, msg: "" });
  const { replace, push, pathname } = useRouter();

  const [binPosts, { client }] = useMutation(BIN_POSTS);

  const handleResponse = (msg: string, shouldPush = false) => {
    onCloseDialog();
    setIsBinning(false);
    setToast({ open: true, msg });

    if (shouldPush) {
      client.cache.evict({ id: "ROOT_QUERY", fieldName: "getPosts" });
      void push("/posts");
    }
  };

  const binPostsFn = () => {
    const MSG = `You are unable to bin posts right now. Please try again later`;

    setIsBinning(true);

    void binPosts({
      variables: { postIds },
      onError: err => handleResponse(err.graphQLErrors?.[0].message ?? MSG),
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
            handleResponse(binData.binPosts.message);
            break;

          case "PostsWarning":
            handleResponse(binData.binPosts.message, true);
            break;

          case "Posts":
            handleResponse(`${postOrPosts} binned`, true);
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

export default useBinPosts;
