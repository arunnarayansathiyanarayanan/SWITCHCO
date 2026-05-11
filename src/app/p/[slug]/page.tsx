import { notFound } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function PublicProjectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: project } = await supabase
    .from("projects")
    .select("title,summary,tools_used,workflow_definition,status,progress_percent,created_at")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle();

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-10">
      <header className="glass rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wide text-cyan-300">Public Proof-of-Work</p>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-50">{project.title}</h1>
        <p className="mt-3 text-zinc-300">{project.summary}</p>
      </header>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-medium text-zinc-100">Project Meta</h2>
        <div className="mt-3 grid gap-3 text-sm text-zinc-300 md:grid-cols-3">
          <p>Status: {project.status}</p>
          <p>Progress: {project.progress_percent}%</p>
          <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
        </div>
        <p className="mt-4 text-sm text-zinc-400">Tools: {(project.tools_used ?? []).join(", ") || "Not specified"}</p>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-medium text-zinc-100">Workflow Blueprint</h2>
        <pre className="mt-3 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300">
          {JSON.stringify(project.workflow_definition ?? {}, null, 2)}
        </pre>
      </section>
    </div>
  );
}
