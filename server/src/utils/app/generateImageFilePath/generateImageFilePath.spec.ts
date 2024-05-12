import { it, expect, describe } from "@jest/globals";
import { generateImageFilePath } from ".";

describe("Utils | Generate supabase image file path", () => {
  it("Should generate an avatar filepath", async () => {
    const avatarFilepath = await generateImageFilePath("avatar", "image/jpeg");

    expect(avatarFilepath).toMatch(/^avatar\/[\w-]+\.jpg$/);
    expect(avatarFilepath).not.toMatch(/post\/banner/);
    expect(avatarFilepath).not.toMatch(/post\/content-image/);
  });

  it("Should generate a post banner filepath", async () => {
    const postBannerFilepath = await generateImageFilePath(
      "postBanner",
      "image/png"
    );

    expect(postBannerFilepath).toMatch(/^post\/banner\/[\w-]+\.png$/);
    expect(postBannerFilepath).not.toMatch(/avatar/);
    expect(postBannerFilepath).not.toMatch(/post\/content-image/);
  });

  it("Should generate a post content image filepath", async () => {
    const contentImageFilepath = await generateImageFilePath(
      "postContentImage",
      "image/webp"
    );

    expect(contentImageFilepath).toMatch(/^post\/content-image\/[\w-]+\.webp$/);
    expect(contentImageFilepath).not.toMatch(/avatar/);
    expect(contentImageFilepath).not.toMatch(/post\/banner/);
  });
});
