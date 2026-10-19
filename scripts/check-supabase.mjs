import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  realtime: {
    transport: class {
      close() {}
      send() {}
      addEventListener() {}
      removeEventListener() {}
    },
  },
});

const { error } = await supabase.from("leads").select("id").limit(1);

if (error) {
  console.error("Connection failed:", error.message);
  process.exit(1);
}

console.log("Connected. The leads table is reachable with the secret key.");
