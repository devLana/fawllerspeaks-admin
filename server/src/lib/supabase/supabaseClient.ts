import { createClient } from "@supabase/supabase-js";
import { env } from "@lib/env";

const supabase = () => {
  const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = "https://fbhlqmxmksuadysmuitp.supabase.co";

  const storageUrl = `${supabaseUrl}/storage/v1/object/public/images/`;
  const client = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  return { storageUrl, client };
};

export default supabase;
