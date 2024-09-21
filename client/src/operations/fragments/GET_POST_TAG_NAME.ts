import { gql, type TypedDocumentNode } from "@apollo/client";

export const GET_POST_TAG_NAME: TypedDocumentNode<{ name: string }> = gql`
  fragment GetPostTagName on PostTag {
    name
  }
`;
