import { useTranslations } from "next-intl";

import { sandboxExperiments } from "@/lib/sandbox/experiments";

import Container from "@/components/Container";
import SandboxCard from "@/components/sandbox/SandboxCard";

export default function SandboxSection() {
  const t = useTranslations("Sandbox");

  return (
    <section className="bg-background text-foreground border-border relative overflow-hidden border-t px-7 py-16 transition-colors md:px-11 md:py-20 xl:px-0">
      <div
        aria-hidden="true"
        className="bg-primary/10 pointer-events-none absolute right-0 bottom-0 h-72 w-72 rounded-full blur-3xl"
      />

      <Container>
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="font-en text-primary text-sm font-semibold tracking-[0.2em]">
              {t("label")}
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              {t("title")}
            </h2>

            <p className="text-muted mt-4 max-w-2xl leading-7">
              {t("description")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {sandboxExperiments.map((experiment) => (
              <SandboxCard key={experiment.slug} experiment={experiment} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
