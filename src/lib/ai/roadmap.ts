import OpenAI from "openai";
import { z } from "zod";

import type { OnboardingProfile, TransformationRoadmap } from "@/types/domain";

const roadmapSchema = z.object({
  title: z.string(),
  mission: z.string(),
  milestones: z.array(
    z.object({
      title: z.string(),
      week: z.number(),
      outcome: z.string()
    })
  ),
  nextAction: z.string()
});

export async function generateRoadmap(profile: OnboardingProfile): Promise<TransformationRoadmap> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      title: "AI Native Operator Sprint",
      mission: `Transition from ${profile.currentRole} to ${profile.desiredRole} through weekly proof-of-work`,
      milestones: [
        { title: "Build first workflow", week: 1, outcome: "Working automation published to portfolio" },
        { title: "Deploy mini AI tool", week: 3, outcome: "Public project with case study" },
        { title: "Career proof system", week: 6, outcome: "Portfolio + LinkedIn assets + demo reel" }
      ],
      nextAction: "Create your first automation in the Builder Workspace now."
    };
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Create a high-agency AI career transformation roadmap.
User profile: ${JSON.stringify(profile)}
Return strictly valid JSON with title, mission, milestones[{title,week,outcome}], nextAction.`;

  const completion = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: prompt
  });

  const text = completion.output_text || "{}";
  return roadmapSchema.parse(JSON.parse(text));
}
