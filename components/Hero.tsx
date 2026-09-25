import Image from "next/image";
import { useTranslations } from "next-intl";

import Container from "@/components/Container";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/hero/hero-light.webp"
        alt=""
        width={1536}
        height={1024}
        priority
        className="h-auto w-full dark:hidden"
      />

      <Image
        src="/images/hero/hero-dark.webp"
        alt=""
        width={1536}
        height={1024}
        priority
        className="hidden h-auto w-full dark:block"
      />

      <div className="absolute inset-0 flex items-center pb-[9%]">
        <Container>
          <h1 className="hero-catchcopy text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-200 md:text-5xl xl:text-6xl">
            {t("title")}
          </h1>
        </Container>
      </div>
    </section>
  );
}
