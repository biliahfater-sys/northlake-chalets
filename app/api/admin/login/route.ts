import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ passcode: z.string().min(1).max(128) });

/**
 * Back-office gate. The passcode lives only in ADMIN_PASSCODE on the
 * server — it is never shipped to the client bundle. With no env set the
 * back office is disabled entirely (safe default for production).
 */
export async function POST(request: Request) {
  // brute-force guard: 5 attempts per minute per client
  const key = clientKey(request);
  const limit = rateLimit(`admin:${key}`, 5, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const expected = process.env.ADMIN_PASSCODE;
  if (!expected) {
    return NextResponse.json(
      { error: "Back office is disabled — set ADMIN_PASSCODE to enable it." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 422 });
  }

  if (parsed.data.passcode !== expected) {
    return NextResponse.json({ error: "Wrong passcode" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
