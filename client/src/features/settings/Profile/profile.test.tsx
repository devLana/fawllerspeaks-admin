import { useRouter } from "next/router";

import { screen } from "@testing-library/react";

import ProfilePage from "@pages/settings/me";
import { renderUI } from "@utils/tests/renderUI";
import { writeUser, firstName, lastName } from "@utils/tests/user";

describe("User Profile Page", () => {
  describe("On load with 'status' url params", () => {
    afterAll(() => {
      const router = useRouter();
      router.query = {};
    });

    it.each([
      [
        "Expect an alert message if the user's profile was successfully updated without an image upload error",
        "upload",
        "Profile updated",
      ],
      [
        "Expect an alert message if the user's profile was updated but with an image upload error",
        "upload-error",
        "Profile updated. But there was an error uploading your new profile image. Please try uploading an image later",
      ],
    ])("%s", (_, status, message) => {
      const router = useRouter();
      router.query = { status };

      renderUI(<ProfilePage />);

      expect(screen.getByRole("alert")).toHaveTextContent(message);
    });
  });

  describe("User profile", () => {
    it("Should display the user's name and profile image", () => {
      renderUI(<ProfilePage />, { writeFragment: writeUser(true) });

      expect(
        screen.getByRole("img", { name: `${firstName} ${lastName} avatar` })
      ).toBeInTheDocument();

      expect(screen.getByText(`${firstName} ${lastName}`)).toBeInTheDocument();
    });
  });
});
