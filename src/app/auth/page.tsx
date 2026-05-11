import { signInWithEmail, signUpWithEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AuthPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-6 py-14 md:grid-cols-2">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold text-zinc-50">Become dangerous with AI.</h1>
        <p className="text-zinc-300">Create your AI Career OS account and start your transformation sprint today.</p>
      </section>

      <section className="glass rounded-2xl p-6">
        {error ? (
          <p className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</p>
        ) : null}
        <form className="space-y-4">
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm" />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Password (min 6 characters)"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button className="w-full sm:flex-1" formAction={signInWithEmail} type="submit">
              Sign in
            </Button>
            <Button className="w-full sm:flex-1" formAction={signUpWithEmail} type="submit" variant="outline">
              Create account
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
