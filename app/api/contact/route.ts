import { NextResponse } from "next/server";
import { contactSchema } from "@/features/contact/schema";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";

const TO = process.env.CONTACT_TO_EMAIL ?? "advisors@northlake.estate";
const FROM = process.env.CONTACT_FROM_EMAIL ?? "Northlake <onboarding@resend.dev>";

export async function POST(request: Request) {
  // anti-abuse: 5 enquiries per minute per client
  const key = clientKey(request);
  const limit = rateLimit(`contact:${key}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // optional Cloudflare Turnstile (enforced only when env is configured)
  const human = await verifyTurnstile(data.turnstileToken, key);
  if (!human) {
    return NextResponse.json({ error: "Verification failed" }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;

  // Graceful dev mode: no key configured → accept and log, so the form works
  // end-to-end locally without secrets.
  if (!apiKey) {
    console.info("[contact] (dev, no RESEND_API_KEY) enquiry received:", {
      ...data,
      turnstileToken: undefined,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: data.email,
      subject: `${data.request} — ${data.residence} · ${data.budget}`,
      text: [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "(not given)"}`,
        `Reply by: ${data.contactMethod}`,
        `Residence: ${data.residence}`,
        `Region: ${data.region}`,
        `Budget: ${data.budget}`,
        `Timeline: ${data.timeline}`,
        `Request: ${data.request}`,
        "",
        data.message || "(no message)",
        "",
        "—",
        // 152-ФЗ: proof that consent was given, with a timestamp.
        `Согласие на обработку ПДн: предоставлено (${data.consent ? "да" : "нет"})`,
        `Дата и время заявки (UTC): ${new Date().toISOString()}`,
      ].join("\n"),
    });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("[contact] send failed:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 502 });
  }
}
