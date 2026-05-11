import { installTemplate } from "@/app/actions/projects";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TemplatesPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: templates } = await supabase
    .from("templates")
    .select("id,category,name,description")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <h1 className="text-3xl font-semibold text-zinc-50">Template Marketplace</h1>
      <p className="text-zinc-300">Deploy role-specific workflow templates and personalize them with your context.</p>
      {error ? <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200">{error}</p> : null}
      <section className="grid gap-4 md:grid-cols-3">
        {(templates ?? []).length === 0 ? (
          <article className="glass rounded-2xl p-5 text-sm text-zinc-400">No published templates yet. Seed templates in Supabase to enable installs.</article>
        ) : (
          (templates ?? []).map((template) => (
            <article key={template.id} className="glass rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wide text-cyan-300">{template.category}</p>
              <h2 className="mt-2 text-lg font-medium">{template.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">{template.description}</p>
              <form action={installTemplate} className="mt-4">
                <input type="hidden" name="templateId" value={template.id} />
                <button type="submit" className="rounded-xl border border-zinc-700 px-4 py-2 text-sm hover:border-cyan-400 hover:text-cyan-200">
                  Install to workspace
                </button>
              </form>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
