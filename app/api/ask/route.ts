import {
  AGENT_MODEL,
  ANSWER_SCHEMA,
  SAFE_ANSWER,
  SAFE_SOURCES,
  SYSTEM_PROMPT,
  bannedWording,
  cleanAnswer,
  uncheckedNumbers,
} from "@/lib/agent";
import { AGENT_LIMITS, AGENT_SOURCES, type AgentMessage, type AgentSourceId } from "@/lib/agent-sources";

const HOUR = 60 * 60 * 1000;
const PER_HOUR = 10;
const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < HOUR);
  if (recent.length >= PER_HOUR) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((time) => now - time < HOUR)) hits.delete(key);
    }
  }
  return false;
}

function readMessages(body: unknown): AgentMessage[] | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages: AgentMessage[] = [];
  for (const item of raw.slice(-AGENT_LIMITS.history)) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text) return null;
    if (role === "user" && text.length > AGENT_LIMITS.questionChars) return null;
    messages.push({ role, content: text.slice(0, 1200) });
  }
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

type Draft = { answer: string; sources: AgentSourceId[] } | null;
type ApiMessage = { role: "user" | "assistant" | "system"; content: string };

async function callClaude(key: string, messages: ApiMessage[]): Promise<Draft> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2026-10-21",
    },
    body: JSON.stringify({
      model: AGENT_MODEL,
      max_tokens: 400,
      system: SYSTEM_PROMPT,
      thinking: { type: "disabled" },
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: ANSWER_SCHEMA },
      },
      messages,
    }),
  });
  if (!response.ok) throw new Error(`Claude API ${response.status}`);
  const body = (await response.json()) as {
    stop_reason?: string;
    content?: { type: string; text?: string }[];
  };
  if (body.stop_reason !== "end_turn") return null;
  const text = body.content?.find((block) => block.type === "text")?.text;
  if (!text) return null;
  try {
    const parsed = JSON.parse(text) as { answer?: unknown; sources?: unknown };
    if (typeof parsed.answer !== "string") return null;
    const sources = Array.isArray(parsed.sources)
      ? parsed.sources.filter((id): id is AgentSourceId => typeof id === "string" && id in AGENT_SOURCES)
      : [];
    return { answer: cleanAnswer(parsed.answer), sources: Array.from(new Set(sources)).slice(0, 3) };
  } catch {
    return null;
  }
}

function problems(draft: Draft) {
  if (!draft) return ["The reply was not valid JSON."];
  const issues: string[] = [];
  const numbers = uncheckedNumbers(draft.answer);
  if (numbers.length) {
    issues.push(
      `These numbers are not in the facts: ${numbers.join(", ")}. Use only numbers exactly as the facts write them.`
    );
  }
  const wording = bannedWording(draft.answer);
  if (wording) issues.push(`Do not use the wording "${wording}".`);
  return issues;
}

export async function POST(request: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: "The agent is not set up." }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a question as JSON." }, { status: 400 });
  }
  const messages = readMessages(body);
  if (!messages) {
    return Response.json(
      { error: `Ask a question of up to ${AGENT_LIMITS.questionChars} characters.` },
      { status: 400 }
    );
  }
  if (limited(clientIp(request))) {
    return Response.json(
      { error: "That's the limit for now. The project pages have the full details." },
      { status: 429 }
    );
  }

  try {
    let draft = await callClaude(key, messages);
    let issues = problems(draft);
    if (issues.length) {
      const retry: ApiMessage[] = [
        ...messages,
        {
          role: "system",
          content: `A first draft of this answer broke the rules. ${issues.join(" ")} Write the answer again, following every rule.`,
        },
      ];
      draft = await callClaude(key, retry);
      issues = problems(draft);
    }
    if (!draft || issues.length) {
      return Response.json({ answer: SAFE_ANSWER, sources: [...SAFE_SOURCES], checked: false });
    }
    return Response.json({ answer: draft.answer, sources: draft.sources, checked: true });
  } catch {
    return Response.json({ error: "The agent could not answer right now." }, { status: 502 });
  }
}
