import { useTranslations } from "next-intl";

import Container from "@/components/Container";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="bg-background text-foreground px-7 py-20 transition-colors md:px-11 md:py-28 xl:px-0">
      <Container>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 [text-shadow:0_2px_8px_rgb(15_23_42_/_0.12)] dark:text-slate-200 dark:[text-shadow:0_2px_8px_rgb(255_255_255_/_0.08)] md:text-4xl">
          {t("title")}
        </h1>
      </Container>
    </section>
  );
}
