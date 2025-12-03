import { createClient } from "@supabase/supabase-js";
import { env } from "@lib/env";

const key = env.SUPABASE_SERVICE_ROLE_KEY;
const url = "https://fbhlqmxmksuadysmuitp.supabase.co";
const storageUrl = `${url}/storage/v1/object/public/images/`;

const client = createClient(url, key, { auth: { persistSession: false } });

export { storageUrl, client };
