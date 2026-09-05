import { useTranslations } from "next-intl";

import Container from "@/components/Container";

export default function ApiCommunicationPage() {
  const tSandbox = useTranslations("Sandbox");
  const t = useTranslations("Sandbox.ApiCommunication");

  return (
    <section className="bg-background text-foreground min-h-screen px-7 py-16 transition-colors md:px-11 md:py-20 xl:px-0">
      <Container>
        <div className="mx-auto max-w-5xl">
          <p className="font-en text-primary text-sm font-semibold tracking-[0.2em] uppercase">
            {tSandbox("label")}
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            {t("title")}
          </h1>

          <p className="text-muted mt-4 max-w-2xl leading-7">
            {t("description")}
          </p>
        </div>
      </Container>
    </section>
  );
}
