import { Bot, Code2, Trash2, Wand2 } from "lucide-react";
import Link from "next/link";

import { createProject, deleteProject, updateProject } from "@/app/actions/projects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function WorkspacePage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: projects } = await supabase
    .from("projects")
    .select("id,title,summary,status,progress_percent,is_public,slug")
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold text-zinc-50">AI Builder Workspace</h1>
      <p className="text-zinc-300">Build automations, agents, and mini tools with execution-first prompts and workflow scaffolds.</p>
      {error ? <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">{error}</p> : null}
      <section className="grid gap-4 md:grid-cols-3">
        <article className="glass rounded-2xl p-5">
          <Wand2 className="h-5 w-5 text-violet-300" />
          <h2 className="mt-3 text-lg font-medium">Prompt Playground</h2>
          <p className="mt-2 text-sm text-zinc-400">Experiment with system prompts and evaluate outputs rapidly.</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <Bot className="h-5 w-5 text-cyan-300" />
          <h2 className="mt-3 text-lg font-medium">Agent Composer</h2>
          <p className="mt-2 text-sm text-zinc-400">Define goals, tools, context and autonomous loops for your role.</p>
        </article>
        <article className="glass rounded-2xl p-5">
          <Code2 className="h-5 w-5 text-emerald-300" />
          <h2 className="mt-3 text-lg font-medium">Workflow Builder</h2>
          <p className="mt-2 text-sm text-zinc-400">Compose trigger, AI step, action, and review checkpoints.</p>
        </article>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-xl font-medium text-zinc-100">Create Project</h2>
        <form action={createProject} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="title" required placeholder="Project title" className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm" />
          <input
            name="toolsUsed"
            placeholder="Tools used (comma-separated)"
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
          />
          <textarea
            name="summary"
            required
            placeholder="Summary of what this project solves"
            className="md:col-span-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
            rows={3}
          />
          <select name="status" defaultValue="draft" className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm">
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <input
            name="progressPercent"
            type="number"
            min={0}
            max={100}
            defaultValue={0}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
          />
          <button type="submit" className="md:col-span-2 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-900">
            Create Project
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-medium text-zinc-100">Manage Projects</h2>
        {(projects ?? []).length === 0 ? (
          <p className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-400">No projects yet. Create your first proof-of-work above.</p>
        ) : (
          (projects ?? []).map((project) => (
            <article key={project.id} className="glass rounded-2xl p-5">
              <form action={updateProject} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={project.id} />
                <input
                  name="title"
                  defaultValue={project.title}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
                />
                <input
                  name="progressPercent"
                  type="number"
                  min={0}
                  max={100}
                  defaultValue={project.progress_percent}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
                />
                <textarea
                  name="summary"
                  defaultValue={project.summary}
                  rows={3}
                  className="md:col-span-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
                />
                <select name="status" defaultValue={project.status} className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-zinc-300">
                  <input type="checkbox" name="isPublic" defaultChecked={project.is_public} />
                  Public project page
                  {project.slug ? (
                    <Link href={`/p/${project.slug}`} className="text-cyan-300 hover:underline">
                      View
                    </Link>
                  ) : null}
                </label>
                <button type="submit" className="rounded-xl border border-zinc-700 px-4 py-3 text-sm">
                  Save Changes
                </button>
              </form>
              <form action={deleteProject} className="mt-3">
                <input type="hidden" name="id" value={project.id} />
                <button type="submit" className="inline-flex items-center gap-2 text-sm text-rose-300 hover:text-rose-200">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </form>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
