import type { Need, Volunteer } from "../types";

const GEMINI_API_URL =
    "https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-pro-preview:generateContent";
const apiKey =
  import.meta.env.VITE_GEMINI_API_KEY ?? import.meta.env.GEMINI_API_KEY;

async function callGemini(prompt: string): Promise<string> {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${text}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return text;
}

export async function extractNeedFromReport(rawReport: string) {
  const prompt = `
You are an NGO operations assistant in India.

From the following field report, extract:
- title
- category (Food, Medical, Shelter, Logistics or Other)
- location (area or city)
- urgency (integer 1-5)
- requiredSkills (array of short skill names)
- peopleNeeded (integer)

Return ONLY valid JSON:
{"title":"","category":"","location":"","urgency":3,"requiredSkills":[""],"peopleNeeded":1}

Report:
"""${rawReport}"""
`;

  const text = await callGemini(prompt);
  return JSON.parse(text);
}

export async function rankVolunteersForNeed(
  need: Need,
  volunteers: Volunteer[]
) {
  const prompt = `
You are a volunteer coordinator.

Need:
${JSON.stringify(need)}

Volunteers:
${JSON.stringify(volunteers)}

For each volunteer, assign:
- score (0-100)
- one-sentence reason

Return ONLY JSON array:
[{"volunteerId":"<id>","score":92,"reason":"..."}, ...]
`;

  const text = await callGemini(prompt);
  return JSON.parse(text) as { volunteerId: string; score: number; reason: string }[];
}