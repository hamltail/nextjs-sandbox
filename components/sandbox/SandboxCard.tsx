import Link from "next/link";

import type { SandboxExperiment } from "@/lib/sandbox/sandbox.types";

type SandboxCardProps = {
  experiment: SandboxExperiment;
};

export default function SandboxCard({ experiment }: SandboxCardProps) {
  return (
    <Link
      href={`/sandbox/${experiment.slug}`}
      className="border-border bg-surface/90 hover:border-primary/40 group block rounded-2xl border p-6 shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-en text-primary text-xs font-semibold tracking-[0.18em] uppercase">
            {experiment.access}
          </p>

          <h3 className="mt-3 text-xl font-bold tracking-tight">
            {experiment.title}
          </h3>
        </div>

        <span
          aria-hidden="true"
          className="text-muted group-hover:text-primary text-xl transition-colors"
        >
          →
        </span>
      </div>

      <p className="text-muted mt-4 leading-7">{experiment.description}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {experiment.tags.map((tag) => (
          <span
            key={tag}
            className="bg-primary/5 text-primary rounded-full px-3 py-1 text-xs font-semibold"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
