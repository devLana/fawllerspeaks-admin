import { Buffer, File } from "node:buffer";

import {
  describe,
  it,
  expect,
  jest,
  beforeAll,
  afterAll,
  afterEach,
} from "@jest/globals";
import FormData from "form-data";
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

describe("Upload Post Content Image", () => {
  let server: ApolloServer<APIContext>, url: string;
  let unregisteredJwt: string, registeredJwt: string, expiredJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
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
      const formData = new FormData();

      const res = await postFormData(`${url}upload-image`, formData);

      expect(res.statusCode).toBe(401);
      expect(res.statusMessage).toBe("Unauthorized");
      expect(res.data).toStrictEqual({
        error: { message: "Unable to upload image" },
      });
    });

    const str = `Expect an authentication error response if a request is made with`;

    it.each([
      [`${str} a malformed jwt authorization header`, `Bear ${registeredJwt}`],
      [`${str} an invalid jwt authorization header`, "Bearer json.web.token"],
      [`${str} an expired jwt authorization header`, `Bearer ${expiredJwt}`],
    ])("%s", async (_, jwt) => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${jwt}` };

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(401);
      expect(res.statusMessage).toBe("Unauthorized");
      expect(res.data).toStrictEqual({
        error: { message: "Unable to upload image" },
      });
    });
  });

  describe("Verify authenticated user", () => {
    it("Should return a forbidden error response if the user is not registered", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${unregisteredJwt}` };

      const res = await postFormData(
        `${url}upload-post-content-image`,
        formData,
        headers
      );

      expect(res.statusCode).toBe(403);
      expect(res.statusMessage).toBe("Forbidden");
      expect(res.data).toStrictEqual({
        error: { message: "Unable to upload image" },
      });
    });
  });

  describe("Validate form data request payload", () => {
    it("Expect a bad request error response if no image file was uploaded", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };

      const res = await postFormData(
        `${url}upload-post-content-image`,
        formData,
        headers
      );

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        error: { message: "No image file was uploaded" },
      });
    });

    it("Expect a bad request error response if multiple image files are uploaded", async () => {
      const testImage = new File(["test image file 2"], "profile-image-1.png", {
        type: "image/png",
      });

      const imageData = await image.arrayBuffer();
      const testImageData = await testImage.arrayBuffer();
      const imageOne = Buffer.from(imageData);
      const imageTwo = Buffer.from(testImageData);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("upload", imageOne, imageName);
      formData.append("upload", imageTwo, "profile-image-1.png");

      const res = await postFormData(
        `${url}upload-post-content-image`,
        formData,
        headers
      );

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        error: { message: "Only one image file can be uploaded" },
      });
    });

    it("Expect a bad request error response if the uploaded image file is not an image", async () => {
      const file = new File(["test file"], "file.html", { type: "text/html" });
      const fileArrayBuffer = await file.arrayBuffer();
      const fileBuf = Buffer.from(fileArrayBuffer);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("upload", fileBuf, "file.html");

      const res = await postFormData(
        `${url}upload-post-content-image`,
        formData,
        headers
      );

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        error: { message: "No image file was uploaded" },
      });
    });

    it("Expect a bad request error response if both image and non-image files without an extension are uploaded", async () => {
      const imageFile = new File(["image file without extension"], "file1", {
        type: "image/png",
      });

      const audioFile = new File(["audio file without extension"], "file2", {
        type: "audio/mpeg",
      });

      const imageFileArrayBuffer = await imageFile.arrayBuffer();
      const audioFileArrayBuffer = await audioFile.arrayBuffer();
      const imageBuf = Buffer.from(imageFileArrayBuffer);
      const audioBuf = Buffer.from(audioFileArrayBuffer);
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", imageBuf, "file1");
      formData.append("someOtherFileField", audioBuf, "file2");

      const res = await postFormData(
        `${url}upload-post-content-image`,
        formData,
        headers
      );

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        error: { message: "No image file was uploaded" },
      });
    });
  });

  describe("Send image upload request to supabase", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const mock = uploadImage as jest.MockedFunction<UploadReturn>;

    it("Expect the request to be parsed as long as an upload image field is provided in the form data", async () => {
      mock.mockResolvedValueOnce({ error: null });

      const spy = jest.spyOn(removeFile, "emit");

      const pdfFile = new File(["a non-image file"], "pdfFile.pdf", {
        type: "application/pdf",
      });

      const pdfArrayBuffer = await pdfFile.arrayBuffer();
      const pdfBuf = Buffer.from(pdfArrayBuffer);
      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuf = Buffer.from(imageArrayBuffer);
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("upload", imageBuf, imageName);
      formData.append("someOtherImageFile", imageBuf, imageName);
      formData.append("aNonImageFile", pdfBuf, "pdfFile.pdf");
      formData.append("nonFileField", "avatar");
      formData.append("someOtherNonFileField", "someOtherType");

      const res = await postFormData<{ url: string }>(
        `${url}upload-post-content-image`,
        formData,
        headers
      );

      expect(res.statusCode).toBe(201);
      expect(res.statusMessage).toBe("Created");
      expect(res.data).toHaveProperty("url");
      expect(res.data.url).toMatch(/misc\/post\/content-image\/[\w-]+\.jpe?g$/);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("Expect a server error response if the image upload to Supabase failed", async () => {
      mock.mockResolvedValueOnce({ error: new Error("Error") });

      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuf = Buffer.from(imageArrayBuffer);
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("upload", imageBuf, imageName);

      const res = await postFormData(
        `${url}upload-post-content-image`,
        formData,
        headers
      );

      expect(res.statusCode).toBe(500);
      expect(res.statusMessage).toBe("Internal Server Error");
      expect(res.data).toStrictEqual({
        error: {
          message:
            "Something has gone wrong and your image could not be uploaded. Please try again later",
        },
      });
    });

    it("Expect an image to be uploaded to Supabase successfully", async () => {
      mock.mockResolvedValueOnce({ error: null });

      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuf = Buffer.from(imageArrayBuffer);
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("upload", imageBuf, imageName);

      const res = await postFormData<{ url: string }>(
        `${url}upload-post-content-image`,
        formData,
        headers
      );

      expect(res.statusCode).toBe(201);
      expect(res.statusMessage).toBe("Created");
      expect(res.data).toHaveProperty("url");
      expect(res.data.url).toMatch(/misc\/post\/content-image\/[\w-]+\.jpe?g$/);
    });
  });
});
