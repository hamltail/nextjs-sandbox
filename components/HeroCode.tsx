export default function HeroCode() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="border-primary/10 absolute -inset-5 rounded-3xl border"
      />

      <div className="border-border bg-surface/80 relative overflow-hidden rounded-2xl border shadow-xl backdrop-blur-sm">
        <div className="border-border flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>

          <span className="font-en text-muted text-xs tracking-[0.16em]">
            experiment.ts
          </span>
        </div>

        <pre className="overflow-x-auto px-6 py-7 text-sm leading-7 md:px-8 md:py-9 md:text-base">
          <code className="font-mono">
            <span className="text-accent">const</span>
            <span className="text-foreground"> lab </span>
            <span className="text-muted">=</span>
            <span className="text-foreground"> {"{"}</span>
            {"\n"}
            <span className="text-muted">{"  "}curiosity: </span>
            <span className="text-primary">true</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-muted">{"  "}rules: </span>
            <span className="text-primary">&quot;minimal&quot;</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-muted">{"  "}pace: </span>
            <span className="text-primary">&quot;free&quot;</span>
            <span className="text-foreground">,</span>
            {"\n"}
            <span className="text-foreground">{"}"}</span>
            <span className="text-muted">;</span>
            {"\n\n"}
            <span className="text-accent">while</span>
            <span className="text-foreground"> (lab.curiosity) {"{"}</span>
            {"\n"}
            <span className="text-muted">{"  "}</span>
            <span className="text-foreground">experiment</span>
            <span className="text-muted">(</span>
            <span className="text-primary">lab</span>
            <span className="text-muted">);</span>
            {"\n"}
            <span className="text-foreground">{"}"}</span>
            {"\n\n"}
            <span className="text-muted">{"// "}</span>
            <span className="text-muted italic">
              build. break. learn. repeat.
            </span>
          </code>
        </pre>

        <div className="border-border flex items-center gap-2 border-t px-5 py-3">
          <span className="bg-primary h-1.5 w-1.5 rounded-full" />
          <span className="font-en text-muted text-xs tracking-[0.14em]">
            READY TO EXPERIMENT
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="bg-primary/10 absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full blur-3xl"
      />
    </div>
  );
}
