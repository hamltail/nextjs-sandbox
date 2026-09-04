import { useTranslations } from "next-intl";

import Container from "@/components/Container";

export default function StateManagementPage() {
  const t = useTranslations("Sandbox.StateManagement");

  return (
    <section className="bg-background text-foreground min-h-screen px-7 py-16 transition-colors md:px-11 md:py-20 xl:px-0">
      <Container>
        <div className="mx-auto max-w-5xl">
          <p className="font-en text-primary text-sm font-semibold tracking-[0.2em] uppercase">
            Sandbox
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {t("title")}
          </h1>

          <p className="text-muted mt-4 max-w-2xl leading-7">
            {t("description")}
          </p>

          <div className="border-border bg-surface/90 mt-10 rounded-2xl border p-8 shadow-sm">
            <p className="text-muted">{t("comingSoon")}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
