import { useTranslations } from "next-intl";

import { sandboxExperiments } from "@/lib/sandbox/experiments";

import Container from "@/components/Container";
import SandboxCard from "@/components/sandbox/SandboxCard";

export default function SandboxSection() {
  const t = useTranslations("Sandbox");

  return (
    <section
      id="sandbox"
      className="text-foreground relative px-7 py-16 transition-colors md:px-11 md:py-20 xl:px-0"
    >
      <Container>
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="font-en text-primary text-sm font-semibold tracking-[0.2em]">
              {t("label")}
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
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
