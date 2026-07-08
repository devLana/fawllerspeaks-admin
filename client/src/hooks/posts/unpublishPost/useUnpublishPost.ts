import * as React from "react";
import { useRouter } from "next/router";

import { useMutation } from "@apollo/client/react";
import type { MutationBaseOptions } from "@apollo/client/core/watchQueryOptions";

import { optimisticResponse } from "@cache/optimisticResponse/posts/unpublishPost";
import { UNPUBLISH_POST } from "@mutations/posts/UNPUBLISH_POST";

import type { RefetchQueriesFn, StateSetterFn, Status } from "@appTypes";
import type { UnpublishPostData } from "@appTypes/posts/unpublish/unpublishPost";

type ResponseStatus = Status | "success";

const useUnpublishPost = (
  postId: string,
  slug: string,
  setMessage: StateSetterFn<string | React.ReactElement>,
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
    unselectPost?: (id: string) => void,
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
            handleResponse(unpublishData.unpublishPost.postIdError, "error");
            break;

          case "NotFoundError":
          case "ForbiddenError":
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
    unpublished: () => {
      setStatus("idle");
    },
    unpublishFn,
  };
};

export default useUnpublishPost;
