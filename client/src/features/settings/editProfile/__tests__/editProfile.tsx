describe("Edit Profile", () => {
  describe("Initial page render", () => {
    it.todo("Render form inputs with user details");

    it.todo("Display user profile image details");
  });

  describe("Client side form validation", () => {
    it.todo("Display error messages for empty input fields");
  });

  describe("Make edit profile request", () => {
    describe("Request got one or more input validation errors", () => {
      it.todo("Show error messages on input fields");
    });

    describe("Request got an error/unsupported object response, Display a snackbar message", () => {
      it.todo("If response is an unsupported object");
      it.todo("If server response failed with a graphql error");
      it.todo("If server response resolved with a network error");
      it.todo("If image upload failed");
    });

    describe("Redirect user to auth pages", () => {
      it.todo("User is not logged in, Redirect to login page");
      it.todo("User could not be verified, Redirect to login page");
      it.todo("User is unregistered, Redirect to register page");
    });

    describe("Edit profile request was successful", () => {
      it.todo("Show a confirmation snackbar message", () => {});
    });
  });
});
