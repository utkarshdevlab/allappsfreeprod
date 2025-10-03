'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-violet-50 to-white" />

      {/* Glow blobs */}
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-violet-400/30 blur-3xl" />
      <div className="absolute -bottom-16 -right-16 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />

      {/* Subtle noise overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200 shadow-sm">New • Fresh tools every week</span>

          <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900">
            Your Toolkit for <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-500 bg-clip-text text-transparent">Everything</span>
          </h1>
          <p className="mt-5 mx-auto max-w-3xl text-lg md:text-xl text-gray-600">
            Discover powerful apps and engaging games. No installs, no sign‑ups — just instant access to the tools you need.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tools/apps"
              className="group inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-white font-semibold shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:bg-violet-700"
            >
              Explore Apps
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              href="/tools/games"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-gray-900 font-semibold shadow-sm hover:shadow-md transition"
            >
              Play Games
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-xl mx-auto text-sm text-gray-700">
            <div className="rounded-xl bg-white p-4 ring-1 ring-gray-200 shadow-sm">
              <div className="font-bold text-gray-900">Free</div>
              <div className="text-gray-500">No paywalls</div>
            </div>
            <div className="rounded-xl bg-white p-4 ring-1 ring-gray-200 shadow-sm">
              <div className="font-bold text-gray-900">Fast</div>
              <div className="text-gray-500">Instant access</div>
            </div>
            <div className="rounded-xl bg-white p-4 ring-1 ring-gray-200 shadow-sm">
              <div className="font-bold text-gray-900">Fresh</div>
              <div className="text-gray-500">Weekly updates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
