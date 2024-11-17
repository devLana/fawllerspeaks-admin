import supabase from "@lib/supabase/supabaseClient";

export const deleteFiles = async (filePaths: string[]) => {
  const { client } = supabase();
  const { data, error } = await client.storage.from("images").remove(filePaths);

  return { data, error };
};
