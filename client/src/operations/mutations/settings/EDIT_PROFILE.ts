import { gql, type TypedDocumentNode } from "@apollo/client";

import { USER_FIELDS } from "@fragments/session/user";
import type { MutationEditProfileArgs } from "@appTypes/graphql";
import type { EditProfileData } from "@appTypes/settings/editProfile";

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
