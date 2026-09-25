import { useTranslations } from "next-intl";

import Container from "@/components/Container";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="bg-background text-foreground relative overflow-hidden px-7 py-20 transition-colors md:px-11 md:py-28 xl:px-0">
      <div
        aria-hidden="true"
        className="bg-primary/5 pointer-events-none absolute -top-24 right-[12%] h-72 w-72 rounded-full blur-3xl"
      />

      <div
        aria-hidden="true"
        className="bg-accent/5 pointer-events-none absolute -bottom-32 left-[18%] h-80 w-80 rounded-full blur-3xl"
      />

      <Container>
        <h1 className="hero-catchcopy text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-200 md:text-5xl xl:text-6xl">
          {t("title")}
        </h1>
      </Container>
    </section>
  );
}
