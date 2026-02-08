"use client";

import { motion } from "framer-motion";
import {
  Video,
  ArrowUpRight,
  Github,
  Twitter,
  Instagram,
} from "lucide-react";

export default function FancyFooter() {
  return (
    <footer className="relative overflow-hidden bg-black py-24 px-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-24 right-[-10%] h-[60%] w-[50%] rounded-full bg-red-600/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-24 left-[-10%] h-[50%] w-[40%] rounded-full bg-red-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          {/* TOP CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="mx-auto mb-8 grid h-20 w-20 place-items-center rounded-[2rem] bg-red-600 text-white shadow-2xl shadow-red-600/30">
              <Video className="h-10 w-10" strokeWidth={2.5} />
            </div>

            <h2 className="mb-6 text-4xl md:text-6xl font-bold tracking-tight text-white">
              Start recording <br /> the future.
            </h2>

            <p className="mx-auto mb-10 max-w-md text-lg text-white/60">
              Join creators shipping high-fidelity content with RecordFlow.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* CTA */}
              <button className="flex h-14 items-center gap-2 rounded-full bg-red-600 px-8 text-lg font-semibold text-white transition hover:bg-red-700">
                Join RecordFlow
                <ArrowUpRight className="h-5 w-5" />
              </button>

              {/* SOCIAL */}
              <div className="flex gap-3">
                {[Github, Twitter, Instagram].map((Icon, i) => (
                  <button
                    key={i}
                    className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition hover:bg-red-600 hover:border-red-600"
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* DIVIDER */}
          <div className="mb-12 h-px w-full bg-white/10" />

          {/* BOTTOM BAR */}
          <div className="relative flex w-full flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold text-white">
                RecordFlow<span className="text-red-600">.</span>
              </span>
              <span className="hidden h-4 w-px bg-white/20 md:block" />
              <span className="text-xs uppercase tracking-[0.2em] text-white/40">
                Established 2026 • Global
              </span>
            </div>

            {/* GIANT WORD */}
            <div className="pointer-events-none absolute bottom-[-40px] left-1/2 -translate-x-1/2 select-none text-[120px] md:text-[180px] font-black italic leading-none text-white/5">
              Flow
            </div>

            <div className="flex gap-8">
              {["Privacy", "Terms", "Licensing"].map((item) => (
                <div
                  key={item}
                  
                  className="text-xs font-semibold uppercase tracking-widest text-white/40 transition hover:text-red-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
