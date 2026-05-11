import Link from "next/link";

import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-wide text-zinc-100">
          AI CAREER OS
        </Link>
        <nav className="flex max-w-[55vw] flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2 text-sm text-zinc-400 sm:max-w-none sm:flex-initial sm:justify-start md:gap-6">
          <Link className="hover:text-zinc-100" href="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-zinc-100" href="/workspace">
            Builder
          </Link>
          <Link className="hover:text-zinc-100" href="/mentor">
            Mentor
          </Link>
          <Link className="hover:text-zinc-100" href="/community">
            Community
          </Link>
          <Link className="hover:text-zinc-100" href="/templates">
            Templates
          </Link>
        </nav>
        <Link href="/auth">
          <Button size="default">Start transformation</Button>
        </Link>
      </div>
    </header>
  );
}
