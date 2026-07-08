import { gql } from "@apollo/client";
import { USER_FIELDS } from "@fragments/session/user";

export const CACHE_USER = gql`
  ${USER_FIELDS}
  query CacheUser {
    me {
      ...UserFields
    }
  }
`;
