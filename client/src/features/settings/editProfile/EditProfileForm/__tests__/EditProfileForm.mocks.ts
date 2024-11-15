import { GraphQLError } from "graphql";
import { delay, graphql, HttpResponse } from "msw";
import { setupServer } from "msw/node";

import { EDIT_PROFILE } from "@mutations/editProfile/EDIT_PROFILE";
import { mswData, mswErrors } from "@utils/tests/msw";
import { writeUser, firstName, lastName } from "@utils/tests/user";

export const file = new File(["bar"], "bar.jpg", { type: "image/jpeg" });
export const user = { firstName, lastName };
export const userWithImage = writeUser(true);
export const userWithoutImage = writeUser(false);
export const avatarLabel = { name: /^Profile image upload preview$/i };
export const fName = { name: /^first name$/i };
export const lName = { name: /^last name$/i };
export const userImg = { name: /^current profile image$/i };
export const fileInput = /^Select Profile Image$/i;
export const firstNameError = "Provide first name";
export const lastNameError = "Provide last name";
export const imageError = "Image string cant be empty";
const imageLink = "https://www.mock-image-link/image-name.jpg";
const gqlError = "Unable to edit profile. Please try again later";
const nameStr = (prefix: string) => `${prefix}_FIRST_NAME`;

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
  graphql.mutation(EDIT_PROFILE, async ({ variables: { firstName: name } }) => {
    await delay(50);

    if (name === nameStr("auth")) {
      return mswData("editProfile", "AuthenticationError");
    }

    if (name === nameStr("validate")) {
      return mswData("editProfile", "EditProfileValidationError", {
        firstNameError,
        lastNameError,
        imageError,
      });
    }

    if (name === nameStr("unregistered")) {
      return mswData("editProfile", "RegistrationError");
    }

    if (name === nameStr("unknown")) {
      return mswData("editProfile", "UnknownError");
    }

    if (name === nameStr("unsupported")) {
      return mswData("editProfile", "UnsupportedType");
    }

    if (name === nameStr("imageFail")) return response("imageFail", false);

    if (name === nameStr("newImage")) return response("newImage", true);

    if (name === nameStr("graphql")) {
      return mswErrors(new GraphQLError(gqlError));
    }

    if (name === nameStr("network")) {
      return mswErrors(new Error(), { status: 503 });
    }

    return mswErrors(new Error(), { status: 400 });
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

interface Params {
  pathname: string;
  query: Record<string, string>;
}

export const redirects: [string, Mock, { pathname: string; params: Params }][] =
  [
    [
      "Should redirect to the login page if the user is not logged in",
      auth,
      {
        params: {
          pathname: "/login",
          query: { status: "unauthenticated", redirectTo: "/settings/me/edit" },
        },
        pathname: "/settings/me/edit",
      },
    ],
    [
      "Should redirect to the login page if the user could not be verified",
      unknown,
      {
        params: { pathname: "/login", query: { status: "unauthorized" } },
        pathname: "/settings/me/edit",
      },
    ],
    [
      "Should redirect to the register page if the user is unregistered",
      unregistered,
      {
        params: {
          pathname: "/register",
          query: { status: "unregistered", redirectTo: "/settings/me/edit" },
        },
        pathname: "/settings/me/edit",
      },
    ],
  ];

const text = "Should display an alert message toast if the API";
export const errors: [string, Mock<string>][] = [
  [`${text} responded with an unsupported object type`, unsupported],
  [`${text} throws a graphql error`, gql],
  [`${text} request fails with a network error`, network],
];

export const upload: [string, Mock, [() => Response, Params]][] = [
  [
    "Image upload failed, Should still update the user profile without an image",
    imageFail,
    [cb2, { pathname: "/settings/me", query: { status: "upload-error" } }],
  ],
  [
    "Should update user profile with a new image",
    newImage,
    [cb1, { pathname: "/settings/me", query: { status: "upload" } }],
  ],
];
