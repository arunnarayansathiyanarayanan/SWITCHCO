import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export type MentorProvider = "openai" | "anthropic";

export interface MentorTurn {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface MentorResponse {
  provider: MentorProvider;
  model: string;
  content: string;
}

const OPENAI_MODEL = process.env.OPENAI_MENTOR_MODEL ?? "gpt-4.1-mini";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MENTOR_MODEL ?? "claude-3-5-sonnet-latest";

function resolveProvider(): MentorProvider {
  return process.env.MENTOR_PROVIDER === "anthropic" ? "anthropic" : "openai";
}

export async function generateMentorReply(turns: MentorTurn[]): Promise<MentorResponse> {
  const provider = resolveProvider();

  if (provider === "anthropic") {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is required when MENTOR_PROVIDER=anthropic");
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODEL,
      max_tokens: 500,
      system: "You are an elite AI mentor. Give tactical, execution-focused advice and concise next steps.",
      messages: turns
        .filter((turn) => turn.role !== "system")
        .map((turn) => ({
          role: turn.role === "assistant" ? "assistant" : "user",
          content: turn.content
        }))
    });

    const content = response.content
      .filter((item) => item.type === "text")
      .map((item) => item.text)
      .join("\n")
      .trim();

    return {
      provider,
      model: ANTHROPIC_MODEL,
      content: content || "I need a little more context. What are you trying to build right now?"
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required when MENTOR_PROVIDER=openai");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.responses.create({
    model: OPENAI_MODEL,
    input: [
      {
        role: "system",
        content: "You are an elite AI mentor. Give tactical, execution-focused advice and concise next steps."
      },
      ...turns.map((turn) => ({
        role: turn.role,
        content: turn.content
      }))
    ]
  });

  return {
    provider,
    model: OPENAI_MODEL,
    content: response.output_text?.trim() || "I need a little more context. What are you trying to build right now?"
  };
}
