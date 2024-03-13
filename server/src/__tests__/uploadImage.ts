import { Buffer, File } from "node:buffer";
import { randomUUID } from "node:crypto";

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
import { db } from "@lib/db";

import { upload } from "@utils/upload";
import testUsers from "@tests/createTestUsers/testUsers";
import loginTestUser from "@tests/loginTestUser";
import postFormData from "@tests/postFormData";

import type { APIContext } from "@types";

type UploadReturn = () => Promise<{ error: Error | null }>;

jest.mock("@utils/upload");

describe("Upload image endpoint - E2E", () => {
  const unknownUserId = randomUUID();
  let server: ApolloServer<APIContext>, url: string;
  let unregisteredJwt: string, registeredJwt: string, expiredJwtUser: string;
  let unknownJwt: string;

  beforeAll(async () => {
    ({ server, url } = await startServer(0));
    const { unregisteredUser, registeredUser } = await testUsers(db);

    const logInRegistered = loginTestUser(registeredUser.userId);
    const logInUnregistered = loginTestUser(unregisteredUser.userId);
    const loginExpiredJwtUser = loginTestUser(unregisteredUser.userId, "50");
    const loginUnknownUser = loginTestUser(unknownUserId);

    [registeredJwt, unregisteredJwt, expiredJwtUser, unknownJwt] =
      await Promise.all([
        logInRegistered,
        logInUnregistered,
        loginExpiredJwtUser,
        loginUnknownUser,
      ]);
  });

  afterAll(async () => {
    const clearUsers = db.query(`DELETE FROM users`);
    const stop = server.stop();
    await Promise.all([clearUsers, stop]);
    await db.end();
  });

  const imageName = "profile-image.jpg";
  const image = new File(["test image file"], imageName, {
    type: "image/jpeg",
  });

  describe("Verify user authentication", () => {
    it("Should respond with an authentication error if request does not have a proper authorization header", async () => {
      const formData1 = new FormData();
      const formData2 = new FormData();
      const headers = { authorization: `Bear ${registeredJwt}` };

      const req1 = postFormData(`${url}upload-image`, formData1);
      const req2 = postFormData(`${url}upload-image`, formData2, headers);
      const [res1, res2] = await Promise.all([req1, req2]);

      expect(res1.statusCode).toBe(401);
      expect(res1.statusMessage).toBe("Unauthorized");
      expect(res1.data).toStrictEqual({
        message: "Unable to upload image",
        status: "ERROR",
      });

      expect(res2.statusCode).toBe(401);
      expect(res2.statusMessage).toBe("Unauthorized");
      expect(res2.data).toStrictEqual({
        message: "Unable to upload image",
        status: "ERROR",
      });
    });

    it("Request with an invalid jwt should receive an authentication error response", async () => {
      const formData = new FormData();
      const headers = { authorization: "Bearer json.web.token" };

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(401);
      expect(res.statusMessage).toBe("Unauthorized");
      expect(res.data).toStrictEqual({
        message: "Unable to upload image",
        status: "ERROR",
      });
    });

    it("Request with an expired jwt should receive an authentication error response", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${expiredJwtUser}` };

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(401);
      expect(res.statusMessage).toBe("Unauthorized");
      expect(res.data).toStrictEqual({
        message: "Unable to upload image",
        status: "ERROR",
      });
    });
  });

  describe("Verify user", () => {
    it("User is unknown, Return a forbidden error response", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${unknownJwt}` };

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(403);
      expect(res.statusMessage).toBe("Forbidden");
      expect(res.data).toStrictEqual({
        message: "Unable to upload image",
        status: "ERROR",
      });
    });

    it("Should return a forbidden error response if the user is not registered", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${unregisteredJwt}` };

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(403);
      expect(res.statusMessage).toBe("Forbidden");
      expect(res.data).toStrictEqual({
        message: "Unable to upload image",
        status: "ERROR",
      });
    });
  });

  describe("Validate form data request payload", () => {
    // it("Should respond with a bad request error for a wrong request type", async () => {
    //   const json = {request: "json request"}
    //   const headers = { authorization: `Bearer ${registeredJwt}` };
    //   const res = await postFormData(`${url}upload-image`, json, headers);
    //   expect(res.statusCode).toBe(400);
    //   expect(res.statusMessage).toBe("Forbidden");
    //   expect(res.data).toStrictEqual({
    //     message: "Invalid request type",
    //     status: "ERROR",
    //   });
    // });

    it("Should respond with a bad request error if no image file was uploaded", async () => {
      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        message: "No image file was uploaded",
        status: "ERROR",
      });
    });

    it("Should respond with a bad request error if multiple image files are uploaded", async () => {
      const testImage = new File(["test image file 2"], "profile-image-1.png", {
        type: "image/png",
      });

      const imageData = await image.arrayBuffer();
      const testImageData = await testImage.arrayBuffer();
      const imageOne = Buffer.from(imageData);
      const imageTwo = Buffer.from(testImageData);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", imageOne, imageName);
      formData.append("image", imageTwo, "profile-image-1.png");

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        message: "Only one image file can be uploaded",
        status: "ERROR",
      });
    });

    it("Should respond with a bad request error if uploaded file is not an image", async () => {
      const file = new File(["test file"], "file.html", { type: "text/html" });
      const fileArrayBuffer = await file.arrayBuffer();
      const fileBuf = Buffer.from(fileArrayBuffer);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", fileBuf, "file.html");

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        message: "Only an image file can be uploaded",
        status: "ERROR",
      });
    });

    it("Should respond with a bad request error if an image category field is not provided", async () => {
      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuf = Buffer.from(imageArrayBuffer);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", imageBuf, imageName);

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        message: "Image category type was not provided",
        status: "ERROR",
      });
    });

    it("Should respond with a bad request error if multiple image category fields are present", async () => {
      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuf = Buffer.from(imageArrayBuffer);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", imageBuf, imageName);
      formData.append("type", "music");
      formData.append("type", "video");

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        message: "Only one image category type should be provided",
        status: "ERROR",
      });
    });

    it("Should respond with a bad request error if the image category is neither 'avatar' nor 'post'", async () => {
      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuf = Buffer.from(imageArrayBuffer);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", imageBuf, imageName);
      formData.append("type", "music");

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(400);
      expect(res.statusMessage).toBe("Bad Request");
      expect(res.data).toStrictEqual({
        message: "Image category type must be 'avatar' or 'post'",
        status: "ERROR",
      });
    });
  });

  describe("Send image upload request to supabase", () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const mock = upload as jest.MockedFunction<UploadReturn>;

    it("Image upload fails, Respond with a server error", async () => {
      mock.mockResolvedValueOnce({ error: new Error("Error") });

      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuf = Buffer.from(imageArrayBuffer);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", imageBuf, imageName);
      formData.append("type", "avatar");

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(500);
      expect(res.statusMessage).toBe("Internal Server Error");
      expect(res.data).toStrictEqual({
        message:
          "Something has gone wrong and your image could not be uploaded. Please try again later",
        status: "ERROR",
      });
    });

    it("Image upload succeeds, Send supabase path to saved image", async () => {
      mock.mockResolvedValueOnce({ error: null });

      const imageArrayBuffer = await image.arrayBuffer();
      const imageBuf = Buffer.from(imageArrayBuffer);

      const formData = new FormData();
      const headers = { authorization: `Bearer ${registeredJwt}` };
      formData.append("image", imageBuf, imageName);
      formData.append("type", "post");

      const res = await postFormData(`${url}upload-image`, formData, headers);

      expect(res.statusCode).toBe(201);
      expect(res.statusMessage).toBe("Created");
      expect(res.data).toHaveProperty("image");
      expect(res.data).toHaveProperty("status", "SUCCESS");
    });
  });
});
