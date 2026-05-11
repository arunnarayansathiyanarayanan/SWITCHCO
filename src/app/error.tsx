"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <h2 className="text-2xl font-semibold text-zinc-50">Something broke in the transformation pipeline</h2>
      <p className="mt-3 text-zinc-300">Retry now. If this repeats, check server logs and API credentials.</p>
      <Button className="mt-6" onClick={reset}>
        Retry
      </Button>
    </div>
  );
}
