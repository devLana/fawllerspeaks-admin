import { File } from "node:buffer";

import {
  describe,
  it,
  expect,
  jest,
  beforeAll,
  afterAll,
  afterEach,
} from "@jest/globals";
import type { ApolloServer } from "@apollo/server";

import { startServer } from "@server";
import { db } from "@services/db";
import { uploadImage } from "@services/supabase/uploadImage";
import { removeFile } from "@events/removeFile";
import testUsers from "@utils/tests/createTestUsers/testUsers";
import loginTestUser from "@utils/tests/loginTestUser";
import postFormData from "@utils/tests/postFormData";
import type { APIContext } from "@types";

type UploadReturn = () => Promise<{ error: Error | null }>;

jest.mock("@services/supabase/uploadImage");

describe("Upload Image", () => {
  let server: ApolloServer<APIContext>, url: string;
  let unregisteredJwt: string, registeredJwt: string, expiredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    url = `${url}upload-image`;

    const { unregisteredUser, registeredUser } = await testUsers(db);
    const logInRegistered = loginTestUser(registeredUser.userUUID);
    const logInUnregistered = loginTestUser(unregisteredUser.userUUID);
    const loginExpiredJwtUser = loginTestUser(unregisteredUser.userUUID, "50");

    [registeredJwt, unregisteredJwt, expiredJwt] = await Promise.all([
      logInRegistered,
      logInUnregistered,
      loginExpiredJwtUser,
    ]);
  });

  afterAll(async () => {
    await db.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
    await Promise.all([server.stop(), db.end()]);
  });

  const imageName = "profile-image.jpg";
  const image = new File(["test image file"], imageName, {
    type: "image/jpeg",
  });

  describe("Verify user authentication", () => {
    it("Expect an authentication error response if a request is made without an authorization header", async () => {
      const res = await postFormData(url, new FormData());

      expect(res.statusCode).toBe(401);
      expect(res.statusMessage).toBe("Unauthorized");
      expect(res.data).toEqual({
        error: { message: "Unable to upload image" },
      });
    });

    const str = `Expect an authentication error response if a request is made with`;

    it.each([
      [`${str} a malformed jwt authorization header`, `Bear ${registeredJwt}`],
      [`${str} an invalid jwt authorization header`, "Bearer json.web.token"],
      [`${str} an expired jwt authorization header`, `Bearer ${expiredJwt}`],
    ])("%s", async (_, jwt) => {
      const headers = { authorization: `Bearer ${jwt}` };

      const res = await postFormData(url, new FormData(), headers);

      expect(res.statusCode).toBe(401);
      expect(res.statusMessage).toBe("Unauthorized");
      expect(res.data).toEqual({
        error: { message: "Unable to upload image" },
      });
    });
  });

  describe("Verify authenticated user", () => {
    it("Expect a forbidden error response if the user is not registered", async () => {
      const headers = { authorization: `Bearer ${unregisteredJwt}` };

      const res = await postFormData(url, new FormData(), headers);

      expect(res.statusCode).toBe(403);
      expect(res.statusMessage).toBe("Forbidden");
      expect(res.data).toEqual({
        error: { message: "Unable to upload image" },
      });
    });
  });

  describe("Validate form data request payload", () => {
    it("Expect a bad request error response if no image file was uploaded", async () => {
      const headers = { authorization: `Bearer ${registeredJwt}` };

      const res = await postFormData(url, new FormData(), headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toEqual({
        error: { message: "No image file was uploaded" },
      });
    });

    it("Expect a bad request error response if multiple image files are uploaded", async () => {
      const headers = { authorization: `Bearer ${registeredJwt}` };

      const testImage = new File(["test image file 2"], "profile-image-1.png", {
        type: "image/png",
      });

      const formData = new FormData();
      formData.append("image", image, imageName);
      formData.append("image", testImage, "profile-image-1.png");

      const res = await postFormData(url, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toEqual({
        error: { message: "Only one image file can be uploaded" },
      });
    });

    it("Expect a bad request error response if the uploaded file is not an image", async () => {
      const file = new File(["test file"], "file.html", { type: "text/html" });

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", file, "file.html");

      const res = await postFormData(url, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toEqual({
        error: { message: "No image file was uploaded" },
      });
    });

    it("Expect a bad request error response if the mimetype and extension of the uploaded files could not be determined", async () => {
      const file1 = new File(["file without extension"], "file1");
      const file2 = new File(["another file without extension"], "file2");

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", file1, "file1");
      formData.append("someOtherFileField", file2, "file2");

      const res = await postFormData(url, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toEqual({
        error: { message: "No image file was uploaded" },
      });
    });

    it("Expect a bad request error response if an image category field is not provided", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", image, imageName);

      const res = await postFormData(url, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toEqual({
        error: { message: "Image category type was not provided" },
      });
    });

    it("Expect a bad request error response if multiple image category fields are present", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", image, imageName);
      formData.append("type", "music");
      formData.append("type", "video");

      const res = await postFormData(url, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toEqual({
        error: { message: "Only one image category type should be provided" },
      });
    });

    it("Expect a bad request error response if the image category is neither 'avatar' nor 'post'", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", image, imageName);
      formData.append("type", "music");

      const res = await postFormData(url, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toEqual({
        error: {
          message: "Image category type must be 'avatar' or 'postBanner'",
        },
      });
    });
  });

  describe("Send image upload request to supabase", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    const mock = uploadImage as jest.MockedFunction<UploadReturn>;

    it("Expect the request to be parsed as long as an image file field and category is uploaded", async () => {
      mock.mockResolvedValueOnce({ error: null });

      const spy = jest.spyOn(removeFile, "emit");

      const pdfFile = new File(["a non-image file"], "pdfFile.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", image, imageName);
      formData.append("someOtherImageFile", image, imageName);
      formData.append("aNonImageFile", pdfFile, "pdfFile.pdf");
      formData.append("type", "avatar");
      formData.append("someOtherFieldType", "someOtherType");

      const res = await postFormData<{ image: string }>(url, formData, headers);

      expect(res.statusCode).toBe(201);
      expect(res.statusMessage).toBe("Created");
      expect(res.data).toHaveProperty("image");
      expect(res.data.image).toMatch(/^misc\/avatar\/[\w-]+\.jpe?g$/);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("Expect the extension of the image file to be uploaded to be correctly computed from the mimetype or the filename extension of the provided image file", async () => {
      mock.mockResolvedValueOnce({ error: null });

      const img = new File(["an avatar image file"], "avatar-image", {
        type: "image/png",
      });

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", img, "avatar-image");
      formData.append("type", "postBanner");

      const res = await postFormData<{ image: string }>(url, formData, headers);

      expect(res.statusCode).toBe(201);
      expect(res.statusMessage).toBe("Created");
      expect(res.data).toHaveProperty("image");
      expect(res.data.image).toMatch(/misc\/post\/banner\/[\w-]+\.png$/);
    });

    it("Expect a server error response if the image upload to Supabase fails", async () => {
      mock.mockResolvedValueOnce({ error: new Error("Error") });

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", image, imageName);
      formData.append("type", "avatar");

      const res = await postFormData(url, formData, headers);

      expect(res.statusCode).toBe(500);
      expect(res.statusMessage).toBe("Internal Server Error");
      expect(res.data).toEqual({
        error: {
          message:
            "Something has gone wrong and your image could not be uploaded. Please try again later",
        },
      });
    });

    it("Expect the image to be uploaded to Supabase successfully", async () => {
      mock.mockResolvedValueOnce({ error: null });

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", image, imageName);
      formData.append("type", "postBanner");

      const res = await postFormData<{ image: string }>(url, formData, headers);

      expect(res.statusCode).toBe(201);
      expect(res.statusMessage).toBe("Created");
      expect(res.data).toHaveProperty("image");
      expect(res.data.image).toMatch(/^misc\/post\/banner\/[\w-]+\.jpe?g$/);
    });
  });
});
