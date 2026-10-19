import {
  duplicateLeadMessage,
  leadFieldErrors,
  leadRequestSchema,
} from "@/lib/lead";

type LeadResponse =
  | { ok: true }
  | {
      ok: false;
      error: "validation" | "duplicate" | "unavailable";
      message: string;
      fieldErrors?: Record<string, string>;
    };

export type LeadInsert = {
  name: string;
  phone: string;
  order_type: "one_time" | "subscription";
  product: string | null;
  comment: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  yclid: string | null;
  referrer: string | null;
  landing_path: string | null;
  landing_page: string | null;
};

type InsertResult = { error: { code?: string } | null };

export type LeadsClient = {
  from(table: "leads"): {
    insert(values: LeadInsert): PromiseLike<InsertResult>;
  };
};

function json(body: LeadResponse, status: number) {
  return Response.json(body, { status });
}

export function leadInsert(data: {
  name: string;
  phone: string;
  interest: "one_time" | "subscription";
  product: string | null;
  comment: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  yclid: string | null;
  referrer: string | null;
  landingPath: string | null;
  landingPage: string | null;
}): LeadInsert {
  return {
    name: data.name,
    phone: data.phone,
    order_type: data.interest,
    product: data.product,
    comment: data.comment,
    utm_source: data.utmSource,
    utm_medium: data.utmMedium,
    utm_campaign: data.utmCampaign,
    utm_term: data.utmTerm,
    utm_content: data.utmContent,
    yclid: data.yclid,
    referrer: data.referrer,
    landing_path: data.landingPath,
    landing_page: data.landingPage,
  };
}

export async function submitLead(
  request: Request,
  createClient: () => LeadsClient,
) {
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
    const supabase = createClient();
    const { error } = await supabase.from("leads").insert(leadInsert(parsed.data));

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
