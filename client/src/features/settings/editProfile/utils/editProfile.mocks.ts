import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { EDIT_PROFILE } from "../operations/EDIT_PROFILE";
import { mswData, mswErrors } from "@utils/tests/msw";

const nameStr = (prefix: string) => `${prefix}_FIRST_NAME`;
const imageLink = "https://www.mock-image-link/image-name.jpg";
export const firstNameError = "Provide first name";
export const lastNameError = "Provide last name";
export const imageError = "Image string cant be empty";
const gqlError = "Unable to edit profile. Please try again later";

const msg =
  "You are unable to update your profile at the moment. Please try again later";

const cb1 = () => {
  return HttpResponse.json(
    { image: imageLink, status: "SUCCESS" },
    { status: 201 }
  );
};

const cb2 = () => HttpResponse.error();

const response = (prefix: string, image: boolean) => {
  return mswData("editProfile", "EditedProfile", {
    user: {
      __typename: "User",
      id: "SOME_RANDOM_USER_ID",
      email: "user_mail@example.com",
      firstName: nameStr(prefix),
      lastName: "Last Name",
      image: image ? imageLink : null,
      isRegistered: true,
    },
  });
};

export const server = setupServer(
  graphql.mutation(EDIT_PROFILE, async ({ variables: { firstName } }) => {
    await delay();

    if (firstName === nameStr("auth")) {
      return mswData("editProfile", "AuthenticationError");
    }

    if (firstName === nameStr("validate")) {
      return mswData("editProfile", "EditProfileValidationError", {
        firstNameError,
        lastNameError,
        imageError,
      });
    }

    if (firstName === nameStr("unregistered")) {
      return mswData("editProfile", "RegistrationError");
    }

    if (firstName === nameStr("unknown")) {
      return mswData("editProfile", "UnknownError");
    }

    if (firstName === nameStr("unsupported")) {
      return mswData("editProfile", "UnsupportedType");
    }

    if (firstName === nameStr("imageFail")) return response("imageFail", false);

    if (firstName === nameStr("newImage")) return response("newImage", true);

    if (firstName === nameStr("graphql")) {
      return mswErrors(new GraphQLError(gqlError));
    }

    if (firstName === nameStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }
  })
);

class Mock<T extends string | undefined = undefined> {
  firstName: string;
  lastName: string;

  constructor(prefix: string, readonly message: T) {
    this.firstName = nameStr(prefix);
    this.lastName = "Last Name";
  }
}

export const validate = new Mock("validate", undefined);
const imageFail = new Mock("imageFail", undefined);
const newImage = new Mock("newImage", undefined);
const auth = new Mock("auth", undefined);
const unknown = new Mock("unknown", undefined);
const unregistered = new Mock("unregistered", undefined);
const unsupported = new Mock("unsupported", msg);
const network = new Mock("network", msg);
const gql = new Mock("graphql", gqlError);

export const redirects: [string, Mock, string][] = [
  [
    "Should redirect to the login page if the user is not logged in",
    auth,
    "/login?status=unauthenticated",
  ],
  [
    "Should redirect to the login page if the user could not be verified",
    unknown,
    "/login?status=unauthorized",
  ],
  [
    "Should redirect to the register page if the user is unregistered",
    unregistered,
    "/register?status=unregistered",
  ],
];

const text = "Should display an alert message toast if the api";
export const errors: [string, Mock<string>][] = [
  [`${text} responded with an unsupported object type`, unsupported],
  [`${text} throws a graphql error`, gql],
  [`${text} request fails with a network error`, network],
];

export const upload: [string, Mock, [() => Response, string]][] = [
  [
    "Image upload failed, Should update the user profile without an image",
    imageFail,
    [cb2, "upload-error"],
  ],
  ["Should update user profile with a new image", newImage, [cb1, "upload"]],
];
