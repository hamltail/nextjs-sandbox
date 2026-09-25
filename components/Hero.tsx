import { useTranslations } from "next-intl";

import Container from "@/components/Container";
import CubeScene from "@/components/three/CubeScene";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="bg-background text-foreground relative overflow-hidden px-7 py-20 transition-colors md:px-11 md:py-28 xl:px-0">
      <Container>
        <div className="relative min-h-150">
          <div className="relative z-10 flex min-h-150 items-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800 [text-shadow:0_2px_8px_rgb(15_23_42_/_0.12)] dark:text-slate-200 dark:[text-shadow:0_2px_8px_rgb(255_255_255_/_0.08)] md:text-4xl">
              {t("title")}
            </h1>
          </div>

          <div className="absolute inset-y-0 -right-12 w-full md:-right-20 md:w-4/5">
            <CubeScene />
          </div>
        </div>
      </Container>
    </section>
  );
}
