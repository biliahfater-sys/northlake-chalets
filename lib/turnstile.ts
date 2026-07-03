/**
 * Cloudflare Turnstile verification — fully optional. With no
 * TURNSTILE_SECRET_KEY configured the check passes through, so the form
 * works out of the box; set the env vars and anti-bot turns on with no
 * code changes.
 */

export async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured — skip
  if (!token) return false;

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token, remoteip: ip }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    // verification service unreachable — fail closed for writes
    return false;
  }
}
