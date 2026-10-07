import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid items-center gap-8 rounded-2xl border border-line bg-card p-8 lg:grid-cols-2 lg:p-12">
        <div>
          <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-accent">
            WORKOUT LIBRARY
          </span>
          <h1 className="mt-5 font-heading text-5xl font-bold leading-[1.05] text-white sm:text-6xl">
            TRAIN WITH INTENT.
            <br />
            <span className="text-accent">LOG EVERY SET.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-gray-400">
            Find your next challenge, build a plan that works for you, and keep
            every session moving you forward.
          </p>
          <Link
            href="#library"
            className="mt-7 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-bold tracking-wide text-bg transition hover:brightness-90"
          >
            BROWSE WORKOUTS
          </Link>
        </div>

        <div className="relative h-64 overflow-hidden rounded-xl bg-line lg:h-80">
          <Image
            src="/assets/banner.png"
            alt="Athlete using a strength-training machine"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
