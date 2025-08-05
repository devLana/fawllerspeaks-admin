import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";

import { optimisticResponse } from "@cache/optimisticResponse/posts/undoUnpublishPost";
import { POST_STATUS } from "@fragments/POST_STATUS";
import { UNDO_UNPUBLISH_POST } from "@mutations/undoUnpublishPost/UNDO_UNPUBLISH_POST";
import { SESSION_ID } from "@utils/constants";
import type { StateSetterFn, Status } from "@types";

const useUndoUnpublishPost = (
  postId: string,
  slug: string,
  setMessage: StateSetterFn<string | React.ReactElement>
) => {
  const [status, setStatus] = React.useState<Status>("idle");
  const { replace, pathname } = useRouter();

  const [unpublishPost, { client }] = useMutation(UNDO_UNPUBLISH_POST);

  const undoUnpublishFn = () => {
    const msg = `An unexpected error occurred and you cannot undo the unpublish right now. Please try again later`;
    setStatus("loading");

    void unpublishPost({
      variables: { postId },
      optimisticResponse,
      onError() {
        setStatus("error");
        setMessage(msg);
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
          case "UnknownError":
          case "NotAllowedPostActionError":
            client.writeFragment({
              id: client.cache.identify({ __typename: "Post", url: { slug } }),
              fragment: POST_STATUS,
              data: { __typename: "Post", status: "Unpublished" },
            });

            setStatus("error");
            setMessage(msg);
            break;

          case "SinglePost":
            client.cache.evict({
              id: "ROOT_QUERY",
              fieldName: "getPosts",
              args: { filters: { status: "Unpublished" } },
            });

            setStatus("idle");
            break;

          default:
            setMessage(msg);
            setStatus("error");
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
