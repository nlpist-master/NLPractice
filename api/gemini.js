// Gemini proxy with model fallback.
// Order: Flash models best first, then Flash-Lite. GEMINI_MODEL (comma-separated) overrides it.
// Each model gets its own time limit. Daily/minute quota (429), busy/server errors (408, 5xx),
// unknown model (404) or a timeout -> try the next model.

export const config = { maxDuration: 60 };

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite"
];
const PER_MODEL_MS = 20000;   // one slow model can't eat the whole budget
const TOTAL_MS = 50000;       // stay under maxDuration
const NEXT_MODEL = new Set([404, 408, 429, 500, 502, 503, 504]);

function modelList() {
  const env = (process.env.GEMINI_MODEL || "")
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
  return env.length ? env : DEFAULT_MODELS;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ error: "GEMINI_API_KEY is not configured" });
  }

  const { messages, system } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "messages must be an array" });
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: typeof m.content === "string" ? m.content : JSON.stringify(m.content) }]
  }));
  const body = JSON.stringify({
    system_instruction: { parts: [{ text: system || "" }] },
    contents
  });

  const started = Date.now();
  const tried = [];

  for (const model of modelList()) {
    const left = TOTAL_MS - (Date.now() - started);
    if (left < 3000) break;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Math.min(PER_MODEL_MS, left));
    try {
      const response = await fetch(`${BASE}/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
        body,
        signal: controller.signal
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        tried.push(`${model}: HTTP ${response.status}`);
        if (NEXT_MODEL.has(response.status)) continue;
        return res.status(response.status).json({ error: data?.error?.message || "Gemini API error", tried });
      }

      const text = (data?.candidates?.[0]?.content?.parts || [])
        .map((p) => p.text || "")
        .join("")
        .trim();
      if (!text) {
        tried.push(`${model}: empty answer`);
        continue;
      }
      return res.status(200).json({ text, model });
    } catch (error) {
      tried.push(`${model}: ${error.name === "AbortError" ? "timeout" : "network error"}`);
    } finally {
      clearTimeout(timer);
    }
  }

  console.error("Gemini: no model answered", tried);
  return res.status(503).json({ error: "No Gemini model answered in time. Please try again.", tried });
}
