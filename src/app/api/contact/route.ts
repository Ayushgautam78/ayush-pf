const MAX_BODY_BYTES = 20_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 100,
  email: 200,
  countryCode: 6,
  phone: 30,
  reason: 60,
  message: 5000,
};

type Field = keyof typeof LIMITS;

const fail = (status: number, error: string) => Response.json({ error }, { status });

/**
 * Delivers contact form submissions by email through Resend.
 *
 * Needs RESEND_API_KEY and CONTACT_TO_EMAIL (see .env.example). Without them
 * it reports that it is not configured rather than pretending to succeed.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";
  if (!apiKey || !to) return fail(503, "not_configured");

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return fail(413, "too_large");

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail(400, "invalid");
  }

  // Bots fill every field, including this one, which people never see
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const fields = {} as Record<Field, string>;
  for (const key of Object.keys(LIMITS) as Field[]) {
    const value = typeof body[key] === "string" ? (body[key] as string).trim() : "";
    if (value.length > LIMITS[key]) return fail(400, "invalid");
    fields[key] = value;
  }
  if (!fields.name || !EMAIL_PATTERN.test(fields.email)) return fail(400, "invalid");

  const name = fields.name.replace(/[\r\n]+/g, " ");
  const text = [
    `Name: ${name}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone ? `${fields.countryCode} ${fields.phone}` : "-"}`,
    `Reason: ${fields.reason || "-"}`,
    "",
    fields.message || "(no message)",
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: fields.email,
      subject: `Portfolio: ${fields.reason || "New message"} from ${name}`,
      text,
    }),
  });

  if (!response.ok) {
    console.error("Contact email failed", response.status, await response.text());
    return fail(502, "send_failed");
  }

  return Response.json({ ok: true });
}
