import { useTranslations } from "next-intl";

import Container from "@/components/Container";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="text-foreground px-7 py-20 transition-colors md:px-11 md:py-28 xl:px-0">
      <Container>
        <h1 className="hero-catchcopy text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-200 md:text-4xl xl:text-5xl">
          {t("title")}
        </h1>
      </Container>
    </section>
  );
}
