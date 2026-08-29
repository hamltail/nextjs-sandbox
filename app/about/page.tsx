import { useTranslations } from "next-intl";

import Container from "@/components/Container";

export default function AboutPage() {
  const t = useTranslations("About");

  return (
    <section className="bg-background text-foreground px-7 py-16 transition-colors md:px-11 xl:px-0">
      <Container>
        <div className="fade-in mx-auto max-w-3xl">
          <p className="font-en text-primary text-sm font-semibold tracking-[0.2em] uppercase">
            {t("label")}
          </p>

          <h1 className="font-en mt-4 text-5xl font-bold tracking-tight">
            {t("title")}
          </h1>

          <p className="text-muted mt-6 text-lg leading-8">
            {t("description")}
          </p>

          <div className="mt-18 space-y-18">
            <section>
              <h2 className="text-2xl font-bold">{t("environment.title")}</h2>

              <p className="text-muted mt-4 leading-8">
                {t("environment.description")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold">{t("privacy.title")}</h2>

              <div className="text-muted mt-4 space-y-4 leading-8">
                <p>{t("privacy.data")}</p>

                <p>{t("privacy.sensitiveInformation")}</p>

                <p>{t("privacy.disclaimer")}</p>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}
