import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/app/actions/auth";
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
        <form action={signInWithGoogle} className="mb-4">
          <Button variant="outline" className="w-full">
            Continue with Google
          </Button>
        </form>
        <div className="mb-4 border-t border-zinc-800" />
        <form action={signInWithEmail} className="space-y-4">
          <input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm" />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm"
          />
          <Button className="w-full">Sign in</Button>
        </form>
        <form action={signUpWithEmail} className="mt-3">
          <Button variant="outline" className="w-full">
            Create account
          </Button>
        </form>
      </section>
    </div>
  );
}
