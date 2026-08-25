import Container from "@/components/Container";
import HeroScene from "@/components/hero/HeroScene";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-7 py-20 md:px-11 md:py-28 xl:px-0">
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

              <p className="mt-8 max-w-md leading-8 text-gray-600">
                作って、試して、探索するWebのラボ。
              </p>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 w-full md:w-2/3">
            <HeroScene />
          </div>
        </div>
      </Container>
    </section>
  );
}
