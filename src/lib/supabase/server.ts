import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function requiredEnv(name: "SUPABASE_URL" | "SUPABASE_SECRET_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}`);
  }
  return value;
}

export function createSupabaseServerClient(): SupabaseClient {
  return createClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SECRET_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      realtime: {
        transport: class {
          readonly CONNECTING = 0;
          readonly OPEN = 1;
          readonly CLOSING = 2;
          readonly CLOSED = 3;
          readonly readyState = 3;
          readonly url = "";
          readonly protocol = "";
          onopen = null;
          onmessage = null;
          onclose = null;
          onerror = null;
          close() {}
          send() {}
          addEventListener() {}
          removeEventListener() {}
        },
      },
    },
  );
}
