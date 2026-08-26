import Container from "@/components/Container";
import HeroScene from "@/components/hero/HeroScene";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white px-7 py-20 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white md:px-11 md:py-28 xl:px-0">
      <Container>
        <div className="relative min-h-[600px]">
          <div className="relative z-10 flex min-h-[600px] items-center">
            <div>
              <p className="font-en text-sm tracking-[0.25em] text-teal-600 uppercase dark:text-teal-300">
                hamltail Web Lab
              </p>

              <h1 className="font-en mt-6 text-6xl leading-[0.9] font-bold tracking-tight md:text-8xl">
                <span className="hero-copy hero-copy-build block">Build.</span>
                <span className="hero-copy hero-copy-test block">Test.</span>
                <span className="hero-copy hero-copy-explore block">
                  Explore.
                </span>
              </h1>

              <p className="hero-copy hero-copy-description mt-8 max-w-md leading-8 text-gray-600 dark:text-gray-300">
                作って、試して、探索するWebのラボ。
              </p>
            </div>
          </div>

          <div className="absolute inset-y-0 -right-12 w-full md:-right-20 md:w-4/5">
            <HeroScene />
          </div>
        </div>
      </Container>
    </section>
  );
}
