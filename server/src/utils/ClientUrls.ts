import type { IClientUrls } from "@types";
import { nodeEnv } from "./nodeEnv";

class ClientUrls implements IClientUrls {
  private readonly env = nodeEnv;

  get login() {
    if (this.env === "production") {
      return "https://app.fawllerspeaks.com/login";
    }

    if (this.env === "development") {
      return "http://localhost:4040/login";
    }

    return "#";
  }

  get forgotPassword() {
    if (this.env === "production") {
      return "https://app.fawllerspeaks.com/forgot-password";
    }

    if (this.env === "development") {
      return "http://localhost:4040/forgot-password";
    }

    return "#";
  }

  get resetPassword() {
    if (this.env === "production") {
      return "https://app.fawllerspeaks.com/reset-password";
    }

    if (this.env === "development") {
      return "http://localhost:4040/reset-password";
    }

    return "#";
  }

  get siteUrl() {
    if (this.env === "production") {
      return "https://fawllerspeaks.com";
    }

    if (this.env === "development") {
      return "http://localhost:4000";
    }

    return "#";
  }
}

export const urls = new ClientUrls();
