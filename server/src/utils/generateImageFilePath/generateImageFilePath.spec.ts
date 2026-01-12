import { it, expect, describe } from "@jest/globals";
import { generateImageFilePath } from ".";

describe("@utils | Generate supabase image file path", () => {
  it("Should generate an avatar filepath", async () => {
    const testFilepath = "temp/os/folder/test-image.jpg";

    const avatarFilepath = await generateImageFilePath("avatar", testFilepath);

    expect(avatarFilepath).toMatch(/^misc\/avatar\/[\w-]+\.jpg$/);
    expect(avatarFilepath).not.toMatch(/post\/banner/);
    expect(avatarFilepath).not.toMatch(/post\/content-image/);
  });

  it("Should generate a post banner filepath", async () => {
    const testFilepath = "another/temp/path/image.png";

    const postBannerFilepath = await generateImageFilePath(
      "postBanner",
      testFilepath
    );

    expect(postBannerFilepath).toMatch(/^misc\/post\/banner\/[\w-]+\.png$/);
    expect(postBannerFilepath).not.toMatch(/avatar/);
    expect(postBannerFilepath).not.toMatch(/post\/content-image/);
  });

  it("Should generate a post content image filepath", async () => {
    const testFilepath = "some/other/path/picture.webp";

    const contentImageFilepath = await generateImageFilePath(
      "postContentImage",
      testFilepath
    );

    expect(contentImageFilepath).toMatch(
      /^misc\/post\/content-image\/[\w-]+\.webp$/
    );

    expect(contentImageFilepath).not.toMatch(/avatar/);
    expect(contentImageFilepath).not.toMatch(/post\/banner/);
  });
});
