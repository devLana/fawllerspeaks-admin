import { createClient } from "@supabase/supabase-js";

const supabase = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Server Error");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const storageUrl = `${supabaseUrl}/storage/v1/object/public/images/`;
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  return { storageUrl, client };
};

export default supabase;
