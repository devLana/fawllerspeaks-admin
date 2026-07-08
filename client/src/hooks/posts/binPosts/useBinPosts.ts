import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client/react";

import { usePostsFilters } from "@hooks/posts/getPosts/usePostsFilters";
import { refetchQueries } from "@cache/refetchQueries/posts/binPosts";
import { update } from "@cache/update/posts/binPosts";
import { BIN_POSTS } from "@mutations/posts/BIN_POSTS";

const useBinPosts = (
  postIds: string[],
  postOrPosts: string,
  onCloseDialog: VoidFunction,
) => {
  const [isBinning, setIsBinning] = React.useState(false);
  const [toast, setToast] = React.useState({ open: false, msg: "" });
  const { replace, push, pathname } = useRouter();

  const [binPosts, { client }] = useMutation(BIN_POSTS);
  const { queryParams, gqlVariables } = usePostsFilters();

  const handleResponse = (msg: string, shouldPush = false) => {
    onCloseDialog();
    setIsBinning(false);
    setToast({ open: true, msg });

    if (shouldPush) {
      const query = { ...queryParams };

      delete query.after;
      void push({ pathname: "/posts", query });
    }
  };

  const binPostsFn = (unselectPosts: (ids: string[]) => void) => {
    const MSG = `You are unable to bin posts right now. Please try again later`;
    const gqlVariablesCopy = { ...gqlVariables };
    delete gqlVariablesCopy.after;

    setIsBinning(true);

    void binPosts({
      variables: { postIds },
      update: update(gqlVariables.status),
      refetchQueries: refetchQueries(gqlVariablesCopy),
      onError: err => {
        handleResponse(err.graphQLErrors?.[0]?.message ?? MSG);
      },
      onCompleted(binData) {
        switch (binData.binPosts.__typename) {
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

          case "PostIdsValidationError":
            handleResponse(binData.binPosts.postIdsError);
            break;

          case "NotFoundError":
            handleResponse(binData.binPosts.message);
            break;

          case "PostsWarning":
            handleResponse(binData.binPosts.message, true);
            unselectPosts(binData.binPosts.posts.map(({ id }) => id));
            break;

          case "Posts":
            handleResponse(`${postOrPosts} binned`, true);
            unselectPosts(binData.binPosts.posts.map(({ id }) => id));
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

export default useBinPosts;
