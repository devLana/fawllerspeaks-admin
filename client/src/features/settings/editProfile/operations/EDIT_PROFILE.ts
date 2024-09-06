import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FIELDS } from "@features/auth/fragments/User";
import type { Mutation, MutationEditProfileArgs } from "@apiTypes";

type EditProfileData = Pick<Mutation, "editProfile">;
type EditProfile = TypedDocumentNode<EditProfileData, MutationEditProfileArgs>;

export const EDIT_PROFILE: EditProfile = gql`
  ${USER_FIELDS}
  mutation EditProfile(
    $firstName: String!
    $lastName: String!
    $image: String
  ) {
    editProfile(firstName: $firstName, lastName: $lastName, image: $image) {
      ... on EditProfileValidationError {
        firstNameError
        lastNameError
        imageError
      }
      ... on BaseResponse {
        __typename
      }
      ... on EditedProfile {
        user {
          ...UserFields
        }
      }
    }
  }
`;
