import type { IClientUrls } from "@types";
import { env } from "../../lib/env";

class ClientUrls implements IClientUrls {
  private readonly env = env.NAME;
  private testUrl = "https://test-url.com";

  get login() {
    if (this.env === "production") {
      return "https://admin.fawllerspeaks.com/login";
    }

    if (this.env === "demo") {
      return "https://admin-demo.fawllerspeaks.com/login";
    }

    if (this.env === "development") return "http://localhost:4040/login";

    return this.testUrl;
  }

  get forgotPassword() {
    if (this.env === "production") {
      return "https://admin.fawllerspeaks.com/forgot-password";
    }

    if (this.env === "demo") {
      return "https://admin-demo.fawllerspeaks.com/forgot-password";
    }

    if (this.env === "development") {
      return "http://localhost:4040/forgot-password";
    }

    return this.testUrl;
  }

  get resetPassword() {
    if (this.env === "production") {
      return "https://admin.fawllerspeaks.com/reset-password";
    }

    if (this.env === "demo") {
      return "https://admin-demo.fawllerspeaks.com/reset-password";
    }

    if (this.env === "development") {
      return "http://localhost:4040/reset-password";
    }

    return this.testUrl;
  }

  get siteUrl() {
    if (this.env === "production" || this.env === "demo") {
      return "https://fawllerspeaks.com";
    }

    if (this.env === "development") return "http://localhost:4000";

    return this.testUrl;
  }
}

export const urls = new ClientUrls();
