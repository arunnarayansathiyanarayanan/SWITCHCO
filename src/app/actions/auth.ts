"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

function requireSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    redirect(
      `/auth?error=${encodeURIComponent("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.")}`
    );
  }
}

export async function signInWithEmail(formData: FormData) {
  requireSupabaseEnv();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/auth?error=${encodeURIComponent(error.message)}`);
  }

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect(
      `/auth?error=${encodeURIComponent(
        "No session after sign-in. If email confirmation is required in Supabase, confirm your email first or disable “Confirm email” for development."
      )}`
    );
  }
  redirect("/onboarding");
}

export async function signUpWithEmail(formData: FormData) {
  requireSupabaseEnv();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(`/auth?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session) {
    redirect(
      `/auth?error=${encodeURIComponent(
        "Account created. Confirm your email in the link Supabase sent you, then sign in. (Or turn off “Confirm email” in Supabase Auth settings for faster local testing.)"
      )}`
    );
  }

  redirect("/onboarding");
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/");
}
