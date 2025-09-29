import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import { optimisticResponse } from "@cache/optimisticResponse/posts/undoUnpublishPost";
import { UNDO_UNPUBLISH_POST } from "@mutations/undoUnpublishPost/UNDO_UNPUBLISH_POST";
import { SESSION_ID } from "@utils/constants";
import type { RefetchQueriesFn, StateSetterFn, Status } from "@types";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";
import type { UndoUnpublishPostData } from "types/posts/unpublish/undoUnpublishPost";

const useUndoUnpublishPost = (
  postId: string,
  slug: string,
  setMessage: StateSetterFn<string | React.ReactElement>
) => {
  const [status, setStatus] = React.useState<Status>("idle");
  const { replace, pathname } = useRouter();

  const [unpublishPost, { client }] = useMutation(UNDO_UNPUBLISH_POST);

  const handleResponse = (msg: string, responseStatus: Status) => {
    setStatus(responseStatus);
    setMessage(msg);
  };

  const undoUnpublishFn = (
    update: MutationBaseOptions<UndoUnpublishPostData>["update"],
    refetchQueries?: RefetchQueriesFn<UndoUnpublishPostData>
  ) => {
    const msg = `An unexpected error occurred and you cannot undo the unpublish right now. Please try again later`;

    setStatus("loading");

    void unpublishPost({
      variables: { postId },
      optimisticResponse: optimisticResponse(slug),
      update,
      refetchQueries,
      onError(err) {
        handleResponse(err.graphQLErrors?.[0]?.message ?? msg, "error");
      },
      onCompleted(data) {
        switch (data.undoUnpublishPost.__typename) {
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
            handleResponse(data.undoUnpublishPost.postIdError, "error");
            break;

          case "UnknownError":
          case "NotAllowedPostActionError":
          case "Response":
            handleResponse(data.undoUnpublishPost.message, "error");
            break;

          case "SinglePost":
            setStatus("idle");
            break;

          default:
            handleResponse(msg, "error");
        }
      },
    });
  };

  return {
    hasError: status === "error",
    isLoading: status === "loading",
    undoneUnpublish: () => setStatus("idle"),
    undoUnpublishFn,
  };
};

export default useUndoUnpublishPost;
