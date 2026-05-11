import { MentorChat } from "@/components/mentor/mentor-chat";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function MentorPage() {
  const supabase = await createServerSupabaseClient();
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData.user?.id;
  const { data: thread } = uid
    ? await supabase
        .from("mentor_threads")
        .select("id")
        .eq("user_id", uid)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()
    : { data: null };

  const { data: messages } = thread
    ? await supabase
        .from("mentor_messages")
        .select("id,role,content")
        .eq("thread_id", thread.id)
        .order("created_at", { ascending: true })
        .limit(30)
    : { data: [] };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold text-zinc-50">AI Mentor</h1>
      <p className="text-zinc-300">
        Context-aware mentor guidance: threads and messages are stored in Supabase for your account and used as model context.
      </p>
      <MentorChat
        initialThreadId={thread?.id ?? null}
        initialMessages={(messages ?? []).map((message) => ({
          id: message.id,
          role: message.role as "user" | "assistant" | "system",
          content: message.content
        }))}
      />
    </div>
  );
}
