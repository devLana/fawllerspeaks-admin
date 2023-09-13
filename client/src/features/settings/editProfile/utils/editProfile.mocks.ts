import { GraphQLError } from "graphql";
import { gql } from "@apollo/client";
import { rest } from "msw";
import { setupServer } from "msw/node";
import type { MockedResponse } from "@apollo/client/testing";

import { EDIT_PROFILE } from "../operations/EDIT_PROFILE";
import { testCache, testUserId } from "@utils/renderTestUI";

interface Input {
  firstName: string;
  lastName: string;
  image?: string | null;
}

interface ErrorsMock {
  gql: () => MockedResponse[];
  input: Input;
  message: string;
}

const imageLink = "https://www.mock-image-link/image-name.jpg";

export const server = setupServer(
  rest.post("http://localhost:7692/upload-image", (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({ image: imageLink, status: "SUCCESS" })
    );
  })
);

export const FIRST_NAME = "FIRST_NAME";
export const LAST_NAME = "LAST_NAME";
const msg =
  "You are unable to update your profile at the moment. Please try again later";

export const clearTestCache = () => {
  testCache.evict({ id: testUserId });
  testCache.gc();
};

export const cacheSetup = (input?: Input, hasImage = false) => {
  testCache.writeFragment({
    id: `User:${testUserId}`,
    data: {
      __typename: "User",
      id: testUserId,
      image: input?.image ? input.image : hasImage ? "image_src" : null,
      firstName: input?.firstName ?? FIRST_NAME,
      lastName: input?.lastName ?? LAST_NAME,
    },
    fragment: gql`
      fragment AddTestUser on User {
        __typename
        id
        image
        firstName
        lastName
      }
    `,
  });
};

const request = (input: Input): MockedResponse["request"] => {
  return { query: EDIT_PROFILE, variables: input };
};

const inputs = (name: string, image: boolean | null = null): Input => {
  const names = {
    firstName: `${name}_${FIRST_NAME}`,
    lastName: `${name}_${LAST_NAME}`,
  };

  if (image === null) return { ...names, image };
  if (!image) return names;
  return { ...names, image: imageLink };
};

class Mock {
  constructor(readonly input: Input, readonly typename: string) {}

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        result: { data: { editProfile: { __typename: this.typename } } },
      },
    ];
  }
}

export const validation = {
  input: inputs("validation", false),
  firstNameError: "Provide first name",
  lastNameError: "Provide last name",
  imageError: "Image string cant be empty",
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        result: {
          data: {
            editProfile: {
              __typename: "EditProfileValidationError",
              firstNameError: this.firstNameError,
              lastNameError: this.lastNameError,
              imageError: this.imageError,
            },
          },
        },
      },
    ];
  },
};

class EditMock {
  constructor(readonly input: Input) {}

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        result: {
          data: {
            editProfile: {
              __typename: "EditedProfile",
              user: {
                __typename: "User",
                id: "SOME_RANDOM_USER_ID",
                email: "user_mail@example.com",
                firstName: this.input.firstName,
                lastName: this.input.lastName,
                image: this.input.image
                  ? this.input.image
                  : this.input.image === null
                  ? null
                  : imageLink,
                isRegistered: true,
              },
            },
          },
        },
      },
    ];
  }
}

export const imageFail = new EditMock(inputs("imageFail", false));
export const newImage = new EditMock(inputs("newImage", true));
export const removeImage = new EditMock(inputs("removeImage", null));

const unsupported = {
  input: inputs("unsupported", false),
  message: msg,
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        result: {
          data: { editProfile: { __typename: "UnsupportedObjectResponse" } },
        },
      },
    ];
  },
};

const network = {
  message: msg,
  input: inputs("network", false),
  gql(): MockedResponse[] {
    return [{ request: request(this.input), error: new Error(this.message) }];
  },
};

const graphql = {
  message: "Unable to edit profile. Please try again later",
  input: inputs("graphql", false),
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        result: { errors: [new GraphQLError(this.message)] },
      },
    ];
  },
};

export const errors: [string, ErrorsMock][] = [
  ["Unsupported object", unsupported],
  ["Graphql error response", graphql],
  ["Network error response", network],
];

const auth = new Mock(inputs("auth", false), "AuthenticationError");
const unknown = new Mock(inputs("unknown", false), "UnknownError");
const unregistered = new Mock(inputs("registered", false), "RegistrationError");

export const redirects: [string, Mock, string][] = [
  [
    "If the user is not logged in redirect to the login page",
    auth,
    "/login?status=unauthenticated",
  ],
  [
    "If the user could not be verified redirect to the login page",
    unknown,
    "/login?status=unauthorized",
  ],
  [
    "If the user is unregistered redirect to the register page",
    unregistered,
    "/register?status=unregistered",
  ],
];
