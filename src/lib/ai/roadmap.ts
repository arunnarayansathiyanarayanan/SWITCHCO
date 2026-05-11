import OpenAI from "openai";
import { z } from "zod";

import type { OnboardingProfile, TransformationRoadmap } from "@/types/domain";

/** Models often wrap JSON in ```json ... ``` — strip that before JSON.parse. */
function extractJsonObjectString(raw: string): string {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

const roadmapSchema = z
  .object({
    title: z.string(),
    mission: z.string(),
    milestones: z.array(
      z.object({
        title: z.string(),
        week: z.number(),
        outcome: z.string()
      })
    ),
    nextAction: z.string().optional(),
    next_action: z.string().optional()
  })
  .transform((r) => ({
    title: r.title,
    mission: r.mission,
    milestones: r.milestones,
    nextAction: r.nextAction ?? r.next_action ?? "Ship one concrete workflow in Builder this week."
  }));

export async function generateRoadmap(profile: OnboardingProfile): Promise<TransformationRoadmap> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local so the server can generate a real roadmap (no static fallback)."
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Create a high-agency AI career transformation roadmap.
User profile: ${JSON.stringify(profile)}
Reply with a single JSON object only (no markdown, no code fences, no commentary).
Keys: "title" (string), "mission" (string), "milestones" (array of {title, week, outcome}), "nextAction" (string).`;

  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  const text = completion.output_text ?? "";
  const jsonSlice = extractJsonObjectString(text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonSlice);
  } catch {
    throw new Error(
      `Roadmap model did not return valid JSON. First 400 chars:\n${text.slice(0, 400)}`
    );
  }
  return roadmapSchema.parse(parsed);
}
