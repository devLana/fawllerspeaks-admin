import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { optimisticResponse } from "@cache/optimisticResponse/posts/unpublishPost";
import { UNPUBLISH_POST } from "@mutations/unpublishPost/UNPUBLISH_POST";
import { SESSION_ID } from "@utils/constants";
import type { RefetchQueriesFn, StateSetterFn, Status } from "@types";
import type { UnpublishPostData } from "types/posts/unpublish/unpublishPost";

type ResponseStatus = Status | "success";

const useUnpublishPost = (
  postId: string,
  slug: string,
  setMessage: StateSetterFn<string | React.ReactElement>
) => {
  const [status, setStatus] = React.useState<ResponseStatus>("idle");
  const { replace, pathname } = useRouter();

  const [unpublishPost, { client }] = useMutation(UNPUBLISH_POST);

  const handleResponse = (msg: string, responseStatus: ResponseStatus) => {
    setStatus(responseStatus);
    setMessage(msg);
  };

  const unpublishFn = (
    update: MutationBaseOptions<UnpublishPostData>["update"],
    refetchQueries?: RefetchQueriesFn<UnpublishPostData>,
    unselectPost?: (id: string) => void
  ) => {
    const msg = `You are unable to unpublish a post right now. Please try again later`;

    setStatus("loading");
    setMessage("Unpublishing post...");

    void unpublishPost({
      variables: { postId },
      optimisticResponse: optimisticResponse(slug),
      update,
      refetchQueries,
      onError(err) {
        handleResponse(err.graphQLErrors?.[0]?.message ?? msg, "error");
      },
      onCompleted(unpublishData) {
        switch (unpublishData.unpublishPost.__typename) {
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
            handleResponse(unpublishData.unpublishPost.postIdError, "error");
            break;

          case "UnknownError":
          case "NotAllowedPostActionError":
          case "Response":
            handleResponse(unpublishData.unpublishPost.message, "error");
            break;

          case "SinglePost":
            handleResponse("Post unpublished", "success");
            unselectPost?.(unpublishData.unpublishPost.post.id);
            break;

          default:
            handleResponse(msg, "error");
        }
      },
    });
  };

  return {
    status,
    unpublished: () => setStatus("idle"),
    unpublishFn,
  };
};

export default useUnpublishPost;
