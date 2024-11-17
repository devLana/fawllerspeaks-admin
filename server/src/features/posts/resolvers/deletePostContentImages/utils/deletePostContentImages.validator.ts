import Joi from "joi";
import supabase from "@lib/supabase/supabaseClient";

export const deletePostContentImageSchema = Joi.array<string[]>()
  .required()
  .items(
    Joi.string().trim().uri().messages({
      "string.empty": "Post content image url cannot be an empty string",
      "string.uri": "Invalid post content image url provided",
    })
  )
  .min(1)
  .custom((images: string[]) => {
    const { storageUrl } = supabase();

    return images.reduce<string[]>((result, image) => {
      if (!image.startsWith(storageUrl)) return result;

      result.push(image.slice(storageUrl.length));
      return result;
    }, []);
  })
  .messages({
    "array.min": "No post content image url was provided",
    "array.base": "The post content image urls input must be an array",
  });
