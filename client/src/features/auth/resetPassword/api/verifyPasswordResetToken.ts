import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { ApolloError } from "@apollo/client";

import apolloClient from "@context/Auth/helpers/apolloClient";
import { VERIFY_PASSWORD_RESET_TOKEN } from "@mutations/resetPassword/VERIFY_PASSWORD_RESET_TOKEN";
import type { ResetPasswordPageData } from "types/resetPassword";

type Query = GetServerSidePropsContext["query"];
type ReturnData = GetServerSidePropsResult<ResetPasswordPageData>;

const verifyPasswordResetToken = async (query: Query): Promise<ReturnData> => {
  const permanent = false;

  if (typeof query.tId !== "string" || !query.tId) {
    return {
      redirect: { destination: "/forgot-password?status=invalid", permanent },
    };
  }

  try {
    const client = apolloClient();

    const { data } = await client.mutate({
      mutation: VERIFY_PASSWORD_RESET_TOKEN,
      variables: { token: query.tId },
    });

    switch (data?.verifyResetToken.__typename) {
      case "VerifyResetTokenValidationError":
        return {
          redirect: {
            destination: "/forgot-password?status=validation",
            permanent,
          },
        };

      case "NotAllowedError":
        return {
          redirect: { destination: "/forgot-password?status=fail", permanent },
        };

      default:
        return {
          redirect: {
            destination: "/forgot-password?status=unsupported",
            permanent,
          },
        };

      case "RegistrationError":
        return { props: { isUnregistered: true } };

      case "VerifiedResetToken":
        return {
          props: {
            verified: {
              email: data.verifyResetToken.email,
              resetToken: data.verifyResetToken.resetToken,
            },
          },
        };
    }
  } catch (err) {
    if (err instanceof ApolloError) {
      const status = err.graphQLErrors?.length > 0 ? "api" : "network";

      return {
        redirect: {
          destination: `/forgot-password?status=${status}`,
          permanent,
        },
      };
    }

    return {
      redirect: { destination: "/forgot-password?status=error", permanent },
    };
  }
};

export default verifyPasswordResetToken;
