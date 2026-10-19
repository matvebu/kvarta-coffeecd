import { submitLead, type LeadInsert } from "@/lib/submit-lead";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  return submitLead(request, () => {
    const supabase = createSupabaseServerClient();
    return {
      from(table: "leads") {
        return {
          insert(values: LeadInsert) {
            return supabase.from(table).insert(values);
          },
        };
      },
    };
  });
}
