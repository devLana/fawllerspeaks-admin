import { gql, type TypedDocumentNode as Node } from "@apollo/client";
import type { Mutation, MutationDeletePostContentImagesArgs } from "@apiTypes";

type Data = Pick<Mutation, "deletePostContentImages">;
type DeletePostContentImages = Node<Data, MutationDeletePostContentImagesArgs>;

export const DELETE_POST_CONTENT_IMAGES: DeletePostContentImages = gql`
  mutation DeletePostContentImages($images: [String!]!) {
    deletePostContentImages(images: $images) {
      ... on BaseResponse {
        __typename
      }
      ... on DeletePostContentImagesValidationError {
        imagesError
      }
    }
  }
`;
