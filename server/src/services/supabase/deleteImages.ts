import { client } from ".";

export const deleteImages = async (imagePaths: string[]) => {
  const { data, error } = await client.storage
    .from("images")
    .remove(imagePaths);

  return { data, error };
};
