import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-wide text-zinc-100">
          AI CAREER OS
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-400 md:flex">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/workspace">Builder</Link>
          <Link href="/mentor">Mentor</Link>
          <Link href="/community">Community</Link>
          <Link href="/templates">Templates</Link>
        </nav>
        <Link href="/auth">
          <Button size="default">Start transformation</Button>
        </Link>
      </div>
    </header>
  );
}
