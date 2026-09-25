import { useTranslations } from "next-intl";

import Container from "@/components/Container";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="bg-background text-foreground px-7 py-20 transition-colors md:px-11 md:py-28 xl:px-0">
      <Container>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
          {t("title")}
        </h1>
      </Container>
    </section>
  );
}
