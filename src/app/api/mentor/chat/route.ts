import { NextResponse } from "next/server";
import { z } from "zod";

import { generateMentorReply } from "@/lib/ai/mentor";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  message: z.string().min(1),
  threadId: z.string().uuid().optional()
});

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  let threadId = parsed.data.threadId;
  if (!threadId) {
    const { data: thread, error: threadError } = await supabase
      .from("mentor_threads")
      .insert({
        user_id: userData.user.id,
        title: parsed.data.message.slice(0, 80),
        updated_at: new Date().toISOString()
      })
      .select("id")
      .single();
    if (threadError || !thread) {
      return NextResponse.json({ error: threadError?.message ?? "Unable to create mentor thread." }, { status: 500 });
    }
    threadId = thread.id;
  }

  const { error: userMessageError } = await supabase.from("mentor_messages").insert({
    thread_id: threadId,
    role: "user",
    content: parsed.data.message
  });

  if (userMessageError) {
    return NextResponse.json({ error: userMessageError.message }, { status: 500 });
  }

  const { data: history, error: historyError } = await supabase
    .from("mentor_messages")
    .select("role,content")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(24);

  if (historyError) {
    return NextResponse.json({ error: historyError.message }, { status: 500 });
  }

  try {
    const response = await generateMentorReply(
      (history ?? []).map((item) => ({
        role: item.role as "user" | "assistant" | "system",
        content: item.content
      }))
    );

    const { error: assistantError } = await supabase.from("mentor_messages").insert({
      thread_id: threadId,
      role: "assistant",
      content: response.content,
      provider: response.provider,
      model: response.model
    });

    if (assistantError) {
      return NextResponse.json({ error: assistantError.message }, { status: 500 });
    }

    await supabase
      .from("mentor_threads")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", threadId)
      .eq("user_id", userData.user.id);

    return NextResponse.json({
      threadId,
      message: response.content,
      provider: response.provider,
      model: response.model
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mentor provider failed." },
      { status: 500 }
    );
  }
}
