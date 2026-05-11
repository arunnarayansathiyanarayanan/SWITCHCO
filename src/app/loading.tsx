export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="h-10 w-72 animate-pulse rounded-lg bg-zinc-800" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="h-32 animate-pulse rounded-2xl bg-zinc-900" />
        <div className="h-32 animate-pulse rounded-2xl bg-zinc-900" />
        <div className="h-32 animate-pulse rounded-2xl bg-zinc-900" />
      </div>
    </div>
  );
}
