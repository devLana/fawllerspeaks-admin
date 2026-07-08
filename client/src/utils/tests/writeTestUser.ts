import type { ApolloClient } from "@apollo/client";

import { USER_FIELDS } from "@fragments/session/user";
import { testUserId } from "./sessionMocks";

export const first = "John";
export const last = "Doe";
export const initials = "JD";
export const image = "https://example.com/storage/images/avatar.jpg";

export const writeTestUser = (
  hasImage: boolean,
): ApolloClient.WriteFragmentOptions<object, object> => ({
  id: `User:${testUserId}`,
  fragment: USER_FIELDS,
  data: {
    __typename: "User",
    id: testUserId,
    email: "user_name_example@email.com",
    firstName: first,
    lastName: last,
    image: hasImage ? "https://example.com/storage/images/avatar.jpg" : null,
    isRegistered: true,
  },
});
