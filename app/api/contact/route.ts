import { CONTACT_LIMITS, isTopic, topicSubject, validateContact } from "@/lib/contact";

const WINDOW = 10 * 60 * 1000;
const PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW);
  if (recent.length >= PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((time) => now - time < WINDOW)) hits.delete(key);
    }
  }
  return false;
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    const body = await request.json();
    data = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  } catch {
    return Response.json({ error: "invalid-request" }, { status: 400 });
  }

  if (text(data.website).trim()) return Response.json({ ok: true });

  const topic = isTopic(data.topic) ? data.topic : "other";
  const fields = { name: text(data.name), email: text(data.email), topic, message: text(data.message) };
  const errors = validateContact(fields);
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  const startedAt = typeof data.startedAt === "number" ? data.startedAt : 0;
  if (!startedAt || Date.now() - startedAt < CONTACT_LIMITS.minMillis) {
    return Response.json({ error: "too-fast" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) return Response.json({ error: "unavailable" }, { status: 503 });

  if (limited(clientIp(request))) return Response.json({ error: "rate-limited" }, { status: 429 });

  const name = fields.name.trim().replace(/[\r\n]+/g, " ");
  const email = fields.email.trim();
  const message = fields.message.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Portfolio: ${topicSubject(topic)}, from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nAbout: ${topicSubject(topic)}\n\n${message}\n`,
      }),
    });
    if (!response.ok) return Response.json({ error: "send-failed" }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "send-failed" }, { status: 502 });
  }
}
