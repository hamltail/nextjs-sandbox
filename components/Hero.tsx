import { useTranslations } from "next-intl";

import Container from "@/components/Container";
import HeroCode from "@/components/HeroCode";

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
        <div className="relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div className="relative z-10">
            <h1 className="whitespace-nowrap text-3xl font-bold tracking-tight text-slate-800 [text-shadow:0_2px_8px_rgb(15_23_42_/_0.12)] dark:text-slate-200 dark:[text-shadow:0_2px_8px_rgb(255_255_255_/_0.08)] md:text-4xl xl:text-5xl">
              {t("title")}
            </h1>
          </div>

          <HeroCode />
        </div>
      </Container>
    </section>
  );
}
