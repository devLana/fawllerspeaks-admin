import { getServerSideProps } from "@pages/reset-password";
import type { GetServerSidePropsContext as GssPContext } from "next";

import * as mocks from "./mocks/resetPasswordGSSP.mocks";

describe("ResetPassword - getServerSideProps", () => {
  describe("Validate password reset token", () => {
    it.each(mocks.verifyValidate)("%s", async (_, tId) => {
      const context = { query: { tId } } as unknown as GssPContext;

      const result = await getServerSideProps(context);

      expect(result).not.toHaveProperty("props");

      expect(result).toHaveProperty(
        "redirect.destination",
        "/forgot-password?status=invalid"
      );
    });
  });

  describe("Verify password reset token", () => {
    beforeAll(() => {
      mocks.server.listen();
    });

    afterAll(() => {
      mocks.server.close();
    });

    describe("Verification resolves with an error or an unsupported object type", () => {
      it.each(mocks.verifyErrorObjects)("%s", async (_, path, token) => {
        const context = { query: { tId: token } } as unknown as GssPContext;

        const result = await getServerSideProps(context);

        expect(result).not.toHaveProperty("props");
        expect(result).toHaveProperty("redirect.destination", path);
      });
    });

    describe("Verification fails with an error", () => {
      it.each(mocks.verifyErrors)("%s", async (_, token, status) => {
        const context = { query: { tId: token } } as unknown as GssPContext;

        const result = await getServerSideProps(context);

        expect(result).not.toHaveProperty("props");

        expect(result).toHaveProperty(
          "redirect.destination",
          `/forgot-password?status=${status}`
        );
      });
    });

    describe.each(mocks.verifyProps)("%s", (_, title, { token, props }) => {
      it(`${title}`, async () => {
        const context = { query: { tId: token } } as unknown as GssPContext;

        const result = await getServerSideProps(context);

        expect(result).not.toHaveProperty("redirect");
        expect(result).toHaveProperty("props", props);
      });
    });
  });
});
