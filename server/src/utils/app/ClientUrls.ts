import type { IClientUrls } from "@types";
import { nodeEnv } from "./nodeEnv";

class ClientUrls implements IClientUrls {
  private readonly env = nodeEnv;
  private testUrl = "https://test-url.com";

  get login() {
    if (this.env === "production") {
      return "https://app.fawllerspeaks.com/login";
    }

    if (this.env === "development") {
      return "http://localhost:4040/login";
    }

    return this.testUrl;
  }

  get forgotPassword() {
    if (this.env === "production") {
      return "https://app.fawllerspeaks.com/forgot-password";
    }

    if (this.env === "development") {
      return "http://localhost:4040/forgot-password";
    }

    return this.testUrl;
  }

  get resetPassword() {
    if (this.env === "production") {
      return "https://app.fawllerspeaks.com/reset-password";
    }

    if (this.env === "development") {
      return "http://localhost:4040/reset-password";
    }

    return this.testUrl;
  }

  get siteUrl() {
    if (this.env === "production") {
      return "https://fawllerspeaks.com";
    }

    if (this.env === "development") {
      return "http://localhost:4000";
    }

    return this.testUrl;
  }
}

export const urls = new ClientUrls();
