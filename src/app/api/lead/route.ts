import {
  duplicateLeadMessage,
  leadFieldErrors,
  leadRequestSchema,
} from "@/lib/lead";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type LeadResponse =
  | { ok: true }
  | {
      ok: false;
      error: "validation" | "duplicate" | "unavailable";
      message: string;
      fieldErrors?: Record<string, string>;
    };

function json(body: LeadResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json(
      {
        ok: false,
        error: "validation",
        message: "Некорректный запрос",
      },
      400,
    );
  }

  const parsed = leadRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        error: "validation",
        message: "Проверьте поля формы",
        fieldErrors: leadFieldErrors(parsed.error),
      },
      400,
    );
  }

  if (parsed.data.company) {
    return json({ ok: true }, 200);
  }

  try {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("leads").insert({
      name: parsed.data.name,
      phone: parsed.data.phone,
      order_type: parsed.data.interest,
      product: parsed.data.product,
      comment: parsed.data.comment,
      utm_source: parsed.data.utmSource,
      utm_medium: parsed.data.utmMedium,
      utm_campaign: parsed.data.utmCampaign,
      utm_term: parsed.data.utmTerm,
      utm_content: parsed.data.utmContent,
      referrer: parsed.data.referrer,
      landing_path: parsed.data.landingPath,
    });

    if (error) {
      if (error.code === "23505") {
        return json(
          {
            ok: false,
            error: "duplicate",
            message: duplicateLeadMessage,
          },
          409,
        );
      }

      console.error("Lead insert failed", error.code ?? "unknown");
      return json(
        {
          ok: false,
          error: "unavailable",
          message: "Не удалось отправить заявку. Попробуйте ещё раз.",
        },
        500,
      );
    }
  } catch (error) {
    console.error(
      "Lead insert failed",
      error instanceof Error ? error.name : "unknown",
    );
    return json(
      {
        ok: false,
        error: "unavailable",
        message: "Не удалось отправить заявку. Попробуйте ещё раз.",
      },
      500,
    );
  }

  return json({ ok: true }, 201);
}
