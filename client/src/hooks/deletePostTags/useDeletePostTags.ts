import { useRouter } from "next/router";

import { useApolloClient } from "@apollo/client";

import { SESSION_ID } from "@utils/constants";
import type { OnCompleted } from "@types";
import type { DeletePostTagsData } from "types/postTags";
import type { PostTagsListAction } from "types/postTags/getPostTags";

const useDeletePostTags = (
  msg: string,
  dispatch: React.Dispatch<PostTagsListAction>,
  handleResponse: (msg: string) => void
) => {
  const { replace, pathname } = useRouter();
  const client = useApolloClient();

  const onCompleted: OnCompleted<DeletePostTagsData> = data => {
    switch (data.deletePostTags.__typename) {
      case "AuthenticationError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace(`/login?status=unauthenticated&redirectTo=${pathname}`);
        break;

      case "NotAllowedError":
        localStorage.removeItem(SESSION_ID);
        void client.clearStore();
        void replace("/login?status=unauthorized");
        break;

      case "RegistrationError":
        void replace(`/register?status=unregistered&redirectTo=${pathname}`);
        break;

      case "DeletePostTagsValidationError":
        handleResponse(data.deletePostTags.tagIdsError);
        dispatch({ type: "CLEAR_SELECTION" });
        break;

      case "UnknownError":
      case "DeletedPostTagsWarning":
        handleResponse(data.deletePostTags.message);
        dispatch({ type: "CLEAR_SELECTION" });
        break;

      case "DeletedPostTags": {
        const { tagIds: deletedTags } = data.deletePostTags;
        const word = deletedTags.length > 1 ? "tags" : "tag";

        handleResponse(`Post ${word} deleted`);
        dispatch({ type: "CLEAR_SELECTION", payload: { deletedTags } });
        break;
      }

      default:
        handleResponse(msg);
    }
  };

  return onCompleted;
};

export default useDeletePostTags;
