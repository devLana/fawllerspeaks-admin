import { it, expect, describe } from "@jest/globals";
import { generateImageFilePath } from ".";

describe("@utils | Generate supabase image file path", () => {
  it("Should generate a filepath with the correct file extension", async () => {
    const filepath = await generateImageFilePath(
      "postContentImage",
      "image/gif",
      "some/other/path/picture"
    );

    expect(filepath).toMatch(/^misc\/post\/content-image\/[\w-]+\.gif$/);
  });

  it("Should generate an avatar filepath", async () => {
    const avatarFilepath = await generateImageFilePath(
      "avatar",
      "image/jpeg",
      "temp/os/folder/test-image.jpg"
    );

    expect(avatarFilepath).toMatch(/^misc\/avatar\/[\w-]+\.jpg$/);
    expect(avatarFilepath).not.toMatch(/post\/banner/);
    expect(avatarFilepath).not.toMatch(/post\/content-image/);
  });

  it("Should generate a post banner filepath", async () => {
    const postBannerFilepath = await generateImageFilePath(
      "postBanner",
      "image/png",
      "another/temp/path/image.png"
    );

    expect(postBannerFilepath).toMatch(/^misc\/post\/banner\/[\w-]+\.png$/);
    expect(postBannerFilepath).not.toMatch(/avatar/);
    expect(postBannerFilepath).not.toMatch(/post\/content-image/);
  });

  it("Should generate a post content image filepath", async () => {
    const contentImageFilepath = await generateImageFilePath(
      "postContentImage",
      "image/webp",
      "some/other/path/picture.webp"
    );

    expect(contentImageFilepath).toMatch(
      /^misc\/post\/content-image\/[\w-]+\.webp$/
    );

    expect(contentImageFilepath).not.toMatch(/avatar/);
    expect(contentImageFilepath).not.toMatch(/post\/banner/);
  });
});
