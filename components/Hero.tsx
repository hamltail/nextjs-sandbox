import Container from "@/components/Container";
import HeroScene from "@/components/hero/HeroScene";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-7 py-20 text-white md:px-11 md:py-28 xl:px-0">
      <Container>
        <div className="relative min-h-[600px]">
          <div className="relative z-10 flex min-h-[600px] items-center">
            <div>
              <p className="font-en text-sm tracking-[0.25em] uppercase">
                hamltail Web Lab
              </p>

              <h1 className="font-en mt-6 text-6xl leading-[0.9] font-bold tracking-tight md:text-8xl">
                Build.
                <br />
                Test.
                <br />
                Explore.
              </h1>

              <p className="mt-8 max-w-md leading-8 text-gray-400">
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
