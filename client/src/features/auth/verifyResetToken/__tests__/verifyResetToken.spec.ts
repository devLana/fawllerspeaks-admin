import * as mocks from "./verifyResetToken.mocks";
import verifyResetToken from "..";

describe("ResetPassword - verifyResetToken API", () => {
  describe("Validate password reset token", () => {
    it("Expect a redirect object if anything other than a no-empty token string is received", async () => {
      const query = { tId: ["token_one", "token_two"] };

      const result = await verifyResetToken(query);

      expect(result).not.toHaveProperty("props");
      expect(result).toHaveProperty(
        "redirect.destination",
        "/forgot-password?status=error"
      );
    });
  });

  describe("Verify password reset token", () => {
    describe("Verification resolves with an error or an unsupported object type", () => {
      it.each(mocks.verifiers)("%s", async (_, tId, status) => {
        const result = await verifyResetToken({ tId });

        expect(result).not.toHaveProperty("props");
        expect(result).toHaveProperty(
          "redirect.destination",
          `/forgot-password?status=${status}`
        );
      });
    });

    describe("Password reset token verified", () => {
      it("Expect password reset data in a props object to be returned", async () => {
        const query = { tId: mocks.VERIFIED_TOKEN };

        const result = await verifyResetToken(query);

        expect(result).not.toHaveProperty("redirect");
        expect(result).toHaveProperty("props", mocks.props);
      });
    });
  });
});
