"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
};

export function MentorChat({
  initialThreadId,
  initialMessages
}: {
  initialThreadId: string | null;
  initialMessages: ChatMessage[];
}) {
  const [threadId, setThreadId] = useState<string | null>(initialThreadId);
  const [messages, setMessages] = useState(initialMessages);
  const [pendingMessage, addPendingMessage] = useOptimistic(messages, (state, message: ChatMessage) => [...state, message]);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isPending, startTransition] = useTransition();

  const viewMessages = useMemo(() => pendingMessage, [pendingMessage]);

  function submitMessage() {
    const content = draft.trim();
    if (!content || isPending) return;

    setDraft("");
    setError(null);
    const optimisticId = `optimistic-${Date.now()}`;
    startTransition(async () => {
      addPendingMessage({ id: optimisticId, role: "user", content });
      try {
        const response = await fetch("/api/mentor/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, threadId: threadId ?? undefined })
        });
        const payload = (await response.json()) as { threadId?: string; message?: string; error?: string };
        if (!response.ok || !payload.message || !payload.threadId) {
          throw new Error(payload.error ?? "Failed to send message.");
        }

        setThreadId(payload.threadId);
        setMessages((state) => [
          ...state,
          { id: optimisticId, role: "user", content },
          { id: `${Date.now()}-assistant`, role: "assistant", content: payload.message ?? "" }
        ]);
      } catch (sendError) {
        setError(sendError instanceof Error ? sendError.message : "Failed to send mentor message.");
      }
    });
  }

  return (
    <section className="glass rounded-2xl p-6">
      <div className="space-y-4">
        {viewMessages.length === 0 ? (
          <p className="text-sm text-zinc-400">Ask your mentor for execution strategy, debugging help, or a next-step plan.</p>
        ) : (
          viewMessages.map((message) => (
            <div
              key={message.id}
              className={`rounded-xl border px-4 py-3 text-sm ${
                message.role === "user"
                  ? "ml-auto max-w-[85%] border-cyan-500/30 bg-cyan-500/10 text-cyan-100"
                  : "max-w-[90%] border-zinc-700 bg-zinc-900 text-zinc-100"
              }`}
            >
              {message.content}
            </div>
          ))
        )}
      </div>
      {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      <div className="mt-5 flex flex-col gap-3 md:flex-row">
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          placeholder="What are you building this week, and where are you stuck?"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
        />
        <button
          type="button"
          onClick={submitMessage}
          disabled={isPending}
          className="rounded-xl bg-zinc-100 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Sending..." : "Send"}
        </button>
      </div>
    </section>
  );
}
