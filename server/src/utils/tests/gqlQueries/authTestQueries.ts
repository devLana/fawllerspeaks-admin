export const CREATE_USER = `#graphql
  mutation CreateUser($email: String!) {
    createUser(email: $email) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on EmailValidationError {
        __typename
        emailError
        status
      }
    }
  }
`;

export const FORGOT_PASSWORD = `#graphql
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on EmailValidationError {
        __typename
        emailError
        status
      }
    }
  }
`;

export const GENERATE_PASSWORD = `#graphql
  mutation GeneratePassword($email: String!) {
    generatePassword(email: $email) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on EmailValidationError {
        __typename
        emailError
        status
      }
    }
  }
`;

export const LOGIN = `#graphql
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ... on LoginValidationError {
        __typename
        emailError
        passwordError
        status
      }

      ... on NotAllowedError {
        __typename
        message
        status
      }

      ... on LoggedInUser {
        __typename
        user {
          __typename
          email
          id
          firstName
          lastName
          image
          isRegistered
          dateCreated
        }
        accessToken
        sessionId
        status
      }
    }
  }
`;

export const LOGOUT = `#graphql
  mutation Logout($sessionId: String!) {
    logout(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        __typename
        sessionIdError
        status
      }

      ... on BaseResponse {
        __typename
        message
        status
      }
    }
  }
`;

export const REFRESH_TOKEN = `#graphql
  mutation RefreshToken($sessionId: String!) {
    refreshToken(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        __typename
        sessionIdError
        status
      }

      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on AccessToken {
        __typename
        accessToken
        status
      }
    }
  }
`;

export const REGISTER_USER = `#graphql
  mutation RegisterUser($userInput: RegisterUserInput!) {
    registerUser(userInput: $userInput) {
      ... on RegisterUserValidationError {
        __typename
        firstNameError
        lastNameError
        passwordError
        confirmPasswordError
        status
      }

      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on RegisteredUser {
        __typename
        user {
          __typename
          email
          id
          firstName
          lastName
          image
          isRegistered
          dateCreated
        }
        status
      }
    }
  }
`;

export const RESET_PASSWORD = `#graphql
  mutation ResetPassword($token: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(token: $token, password: $password, confirmPassword: $confirmPassword) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on ResetPasswordValidationError {
        __typename
        tokenError
        passwordError
        confirmPasswordError
        status
      }
    }
  }
`;

export const VERIFY_PASSWORD_RESET_TOKEN = `#graphql
  mutation VerifyPasswordResetToken($token: String!) {
    verifyResetToken(token: $token) {
      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on VerifyResetTokenValidationError {
        __typename
        tokenError
        status
      }

      ... on VerifiedResetToken {
        __typename
        email
        resetToken
        status
      }
    }
  }
`;

export const VERIFY_SESSION = `#graphql
  mutation VerifySession($sessionId: String!) {
    verifySession(sessionId: $sessionId) {
      ... on SessionIdValidationError {
        __typename
        sessionIdError
        status
      }

      ... on BaseResponse {
        __typename
        message
        status
      }

      ... on VerifiedSession {
        __typename
        user {
          __typename
          email
          id
          firstName
          lastName
          image
          isRegistered
          dateCreated
        }
        accessToken
        status
      }
    }
  }
`;
