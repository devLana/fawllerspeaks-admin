import { GraphQLError } from "graphql";
import type { MockedResponse } from "@apollo/client/testing";

import { EDIT_PROFILE } from "../operations/EDIT_PROFILE";

interface Input {
  firstName: string;
  lastName: string;
  image?: string;
}

const FIRST_NAME = "FIRST_NAME";
const LAST_NAME = "LAST_NAME";

const request = (input: Input): MockedResponse["request"] => {
  return { query: EDIT_PROFILE, variables: input };
};

const inputs = (name: string, image = false): Input => {
  if (image) {
    return {
      firstName: `${name}_${FIRST_NAME}`,
      lastName: `${name}_${LAST_NAME}`,
      image: `https://www.mock-image-link/${name}.jpg`,
    };
  }

  return {
    firstName: `${name}_${FIRST_NAME}`,
    lastName: `${name}_${LAST_NAME}`,
  };
};

class Mock {
  constructor(
    readonly input: Input,
    readonly message: string,
    readonly typename: string
  ) {}

  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        result: {
          data: {
            editProfile: {
              __typename: this.typename,
              message: this.message,
              status: "ERROR",
            },
          },
        },
      },
    ];
  }
}

const auth = new Mock(
  inputs("auth", true),
  "You are not logged in",
  "AuthenticationError"
);

const unknown = new Mock(
  inputs("unknown"),
  "Unable to edit profile",
  "UnknownError"
);

const registered = new Mock(
  inputs("registered", true),
  "User is not registered",
  "RegistrationError"
);

export const validation = {
  input: inputs("validation", true),
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
              status: "ERROR",
            },
          },
        },
      },
    ];
  },
};

export const edit = {
  input: inputs("edit", true),
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
                firstName: FIRST_NAME,
                lastName: LAST_NAME,
                image: "https://www.mock-image-link/edit.jpg",
                isRegistered: true,
              },
              status: "SUCCESS",
            },
          },
        },
      },
    ];
  },
};

const network = {
  message: "You cant edit your profile at the moment. Please try again later",
  input: inputs("network"),
  gql(): MockedResponse[] {
    return [{ request: request(this.input), error: new Error(this.message) }];
  },
};

const graphql = {
  message: "Unable to edit profile. Please try again later",
  input: inputs("graphql"),
  gql(): MockedResponse[] {
    return [
      {
        request: request(this.input),
        result: { errors: [new GraphQLError(this.message)] },
      },
    ];
  },
};
