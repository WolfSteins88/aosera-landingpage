import { NextResponse } from "next/server";
import { ALL_QUESTIONS, CONTACT_FIELDS, missingInStep, type Answers } from "@/lib/survey";
import { isLocale } from "@/lib/site";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

function str(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Validates the raw body and turns it into one readable row (Indonesian labels). */
function toRow(body: Record<string, unknown>) {
  const answers: Answers = {};
  const row: Record<string, string> = {};

  for (const q of ALL_QUESTIONS) {
    const raw = body[q.id];
    if (q.kind === "single") {
      const opt = q.options.find((x) => x.value === raw);
      if (opt) answers[q.id] = opt.value;
      row[q.id] = opt?.label.id ?? "";
      if (opt && opt.value === q.otherValue) row[q.id] += `: ${str(body[`${q.id}Other`], 120)}`;
    } else if (q.kind === "multi") {
      const picked = Array.isArray(raw) ? raw : [];
      const opts = q.options.filter((x) => picked.includes(x.value)).slice(0, q.max);
      answers[q.id] = opts.map((x) => x.value);
      row[q.id] = opts
        .map((x) => (x.value === q.otherValue ? `${x.label.id}: ${str(body[`${q.id}Other`], 120)}` : x.label.id))
        .join("; ");
    } else if (q.kind === "scale") {
      const n = Number(raw);
      const ok = Number.isInteger(n) && n >= q.min && n <= q.max;
      if (ok) answers[q.id] = String(n);
      row[q.id] = ok ? String(n) : "";
    } else if (q.kind === "text") {
      row[q.id] = str(raw, q.maxLength);
    }
  }

  row.name = str(body.name, CONTACT_FIELDS.name.maxLength);
  row.whatsapp = str(body.whatsapp, CONTACT_FIELDS.whatsapp.maxLength).replace(/[^\d+ -]/g, "");
  row.pilot = body.pilot === true ? "Ya" : "Tidak";
  row.lang = typeof body.lang === "string" && isLocale(body.lang) ? body.lang : "id";

  const missing = missingInStep(ALL_QUESTIONS, answers);
  return { row, missing };
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (str(body.website, 200)) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  const { row, missing } = toRow(body);
  if (missing.length) return NextResponse.json({ ok: false, error: "missing", missing }, { status: 422 });

  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!url) {
    console.error("GOOGLE_SHEETS_WEBHOOK_URL is not set");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ secret: process.env.GOOGLE_SHEETS_SECRET ?? "", row }),
      redirect: "follow",
    });
    const result = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !result?.ok) throw new Error(`Sheets webhook failed: ${res.status}`);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
