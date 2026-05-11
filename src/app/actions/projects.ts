"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createServerSupabaseClient } from "@/lib/supabase/server";

const createProjectSchema = z.object({
  title: z.string().min(2),
  summary: z.string().min(8),
  toolsUsed: z.array(z.string()).default([]),
  status: z.enum(["draft", "active", "completed"]).default("draft"),
  progressPercent: z.coerce.number().min(0).max(100).default(0)
});

const updateProjectSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(2),
  summary: z.string().min(8),
  status: z.enum(["draft", "active", "completed"]),
  progressPercent: z.coerce.number().min(0).max(100),
  isPublic: z.boolean()
});

function toSlugBase(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 64);
}

async function getUserIdOrRedirect() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    redirect("/auth");
  }
  return { userId: data.user.id, supabase };
}

async function generateUniqueProjectSlug(supabase: SupabaseClient, userId: string, title: string) {
  const base = `${toSlugBase(title) || "project"}-${userId.slice(0, 8)}`;
  for (let i = 0; i < 20; i += 1) {
    const slug = i === 0 ? base : `${base}-${i + 1}`;
    const { data } = await supabase.from("projects").select("id").eq("slug", slug).maybeSingle();
    if (!data) return slug;
  }
  return `${base}-${Date.now()}`;
}

export async function createProject(formData: FormData) {
  const parsed = createProjectSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    toolsUsed: String(formData.get("toolsUsed") ?? "")
      .split(",")
      .map((tool) => tool.trim())
      .filter(Boolean),
    status: String(formData.get("status") ?? "draft"),
    progressPercent: Number(formData.get("progressPercent") ?? 0)
  });

  if (!parsed.success) {
    redirect(`/workspace?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid project payload.")}`);
  }

  const { userId, supabase } = await getUserIdOrRedirect();
  const slug = await generateUniqueProjectSlug(supabase, userId, parsed.data.title);
  const { error } = await supabase.from("projects").insert({
    user_id: userId,
    title: parsed.data.title,
    summary: parsed.data.summary,
    tools_used: parsed.data.toolsUsed,
    status: parsed.data.status,
    progress_percent: parsed.data.progressPercent,
    slug
  });

  if (error) {
    redirect(`/workspace?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/workspace");
  revalidatePath("/dashboard");
}

export async function updateProject(formData: FormData) {
  const parsed = updateProjectSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    status: String(formData.get("status") ?? "draft"),
    progressPercent: Number(formData.get("progressPercent") ?? 0),
    isPublic: String(formData.get("isPublic") ?? "") === "on"
  });

  if (!parsed.success) {
    redirect(`/workspace?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Invalid project update payload.")}`);
  }

  const { userId, supabase } = await getUserIdOrRedirect();
  const { error } = await supabase
    .from("projects")
    .update({
      title: parsed.data.title,
      summary: parsed.data.summary,
      status: parsed.data.status,
      progress_percent: parsed.data.progressPercent,
      is_public: parsed.data.isPublic,
      updated_at: new Date().toISOString()
    })
    .eq("id", parsed.data.id)
    .eq("user_id", userId);

  if (error) {
    redirect(`/workspace?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/workspace");
  revalidatePath("/dashboard");
}

export async function deleteProject(formData: FormData) {
  const projectId = String(formData.get("id") ?? "");
  if (!projectId) redirect("/workspace?error=Missing%20project%20id");

  const { userId, supabase } = await getUserIdOrRedirect();
  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("user_id", userId);
  if (error) {
    redirect(`/workspace?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/workspace");
  revalidatePath("/dashboard");
}

export async function installTemplate(formData: FormData) {
  const templateId = String(formData.get("templateId") ?? "");
  if (!templateId) {
    redirect("/templates?error=Missing%20template%20id");
  }

  const { userId, supabase } = await getUserIdOrRedirect();
  const { data: template, error: templateError } = await supabase
    .from("templates")
    .select("id,name,description,template_json,is_published")
    .eq("id", templateId)
    .eq("is_published", true)
    .maybeSingle();

  if (templateError || !template) {
    redirect(`/templates?error=${encodeURIComponent(templateError?.message ?? "Template not available.")}`);
  }

  const slug = await generateUniqueProjectSlug(supabase, userId, template.name);
  const templateJson = (template.template_json as Record<string, unknown>) ?? {};
  const toolsUsed = Array.isArray(templateJson.tools)
    ? templateJson.tools.map((tool) => String(tool))
    : [];

  const { error } = await supabase.from("projects").insert({
    user_id: userId,
    title: template.name,
    summary: template.description,
    workflow_definition: templateJson,
    template_id: template.id,
    tools_used: toolsUsed,
    status: "draft",
    progress_percent: 0,
    slug
  });

  if (error) {
    redirect(`/templates?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/templates");
  revalidatePath("/workspace");
  revalidatePath("/dashboard");
  redirect("/workspace");
}
