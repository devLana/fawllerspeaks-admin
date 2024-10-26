import type { Cache } from "@apollo/client/cache/core/types/Cache";
import { USER_FIELDS } from "@fragments/USER";
import { testUserId } from "./renderUI";

export const firstName = "John";
export const lastName = "Doe";
export const initials = "JD";

export const writeUser = (
  hasImage: boolean
): Cache.WriteFragmentOptions<object, object> => ({
  id: `User:${testUserId}`,
  fragment: USER_FIELDS,
  data: {
    __typename: "User",
    id: testUserId,
    email: "user_name_example@email.com",
    firstName,
    lastName,
    image: hasImage ? "https://example.com/storage/images/avatar.jpg" : null,
    isRegistered: true,
  },
});
