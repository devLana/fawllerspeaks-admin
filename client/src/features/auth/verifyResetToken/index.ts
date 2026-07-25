import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import apolloClient from "@providers/Auth/helpers/apolloClient";
import { VERIFY_RESET_TOKEN } from "@queries/auth/verifyResetToken";
import type { ResetPasswordPageData } from "@appTypes/auth/resetPassword";

type Query = GetServerSidePropsContext["query"];
type ReturnData = GetServerSidePropsResult<ResetPasswordPageData>;

const verifyResetToken = async (query: Query): Promise<ReturnData> => {
  const permanent = false;

  if (typeof query.tId !== "string" || !query.tId) {
    return {
      redirect: { destination: "/forgot-password?status=error", permanent },
    };
  }

  try {
    const client = apolloClient();

    const { data } = await client.query({
      query: VERIFY_RESET_TOKEN,
      variables: { token: query.tId },
    });

    switch (data?.verifyResetToken.__typename) {
      case "VerifyResetTokenValidationError":
        throw new Error("Invalid password reset token provided");

      case "ForbiddenError":
        throw new Error("Error trying to verify password reset token");

      case "VerifiedResetToken":
        return {
          props: {
            email: data.verifyResetToken.email,
            resetToken: data.verifyResetToken.resetToken,
          },
        };

      default:
        throw new Error("Unsupported object type received");
    }
  } catch (err) {
    let status = "error";

    if (err instanceof TypeError && err.message === "Failed to fetch") {
      status = "network";
    }

    return {
      redirect: { destination: `/forgot-password?status=${status}`, permanent },
    };
  }
};

export default verifyResetToken;
