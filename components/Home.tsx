"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUiStore } from "@/store/useUiStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Monitor,
  Video,
  ChevronRight,
  Zap,
  Play,
  Mic,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

/* ================= CINEMATIC INLINE SECTION ================= */

function CinematicActionInline({ onStart }: { onStart: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Initialize Optics", icon: Camera },
    { text: "Sync Spatial Audio", icon: Mic },
    { text: "Calibrate Engine", icon: Zap },
    { text: "Finalizing Flow", icon: Sparkles },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const Icon = steps[step].icon;

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-24 px-6">
      <div className="absolute -inset-32 bg-red-500/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* LEFT */}
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
              System Active
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl font-black italic leading-[0.9]">
            Ready to <br />
            <span className="text-red-600 underline decoration-4 underline-offset-8">
              Capture
            </span>
          </h2>

          <div className="space-y-6">
            <div className="relative h-20 max-w-sm overflow-hidden rounded-2xl bg-black/5 border border-black/10 flex items-center px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                      Status
                    </div>
                    <div className="text-sm font-black uppercase">
                      {steps[step].text}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-0 left-0 h-1 w-full bg-black/10">
                <motion.div
                  key={step}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "linear" }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>

            <button
              onClick={onStart}
              className="h-16 px-12 rounded-full bg-black text-white text-lg font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl hover:scale-[1.03] transition"
            >
              Start Recording
              <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <div className="absolute -inset-6 bg-red-500/10 blur-3xl rounded-full" />

          <div className="relative aspect-square rounded-[3rem] bg-white border border-black/10 shadow-2xl overflow-hidden flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="h-64 w-64 rounded-full border border-red-500/20 flex items-center justify-center"
            >
              <div className="h-full w-full rounded-full border border-red-500/30 border-dashed" />
            </motion.div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-white border border-black/10 shadow-xl flex items-center justify-center">
                <Video className="h-16 w-16 text-red-600 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= LANDING PAGE ================= */

export default function LandingPage() {
  const { authUser } = useAuthStore();
  const { open } = useUiStore();

  return (
    <div className="min-h-screen bg-[#fbf7ef]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-[#fde9e2] via-[#fbf7ef] to-[#fbf7ef]" />
        <div className="absolute top-[-35%] left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-red-500/20 blur-[180px]" />

        <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-black">
              The bold way to <br />
              <span className="italic text-red-600">capture</span> and share.
            </h1>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-600 mb-12">
              RecordFlow is the high-contrast recording workspace for creators who ship.
              Crystal clear camera and screen captures with zero friction.
            </p>

            <div className="flex justify-center">
              <Link href={authUser ? "/dashboard" : "#"}>
                <button
                  onClick={() => !authUser && open("Auth")}
                  className="h-14 px-8 rounded-2xl bg-black text-white text-lg font-semibold flex items-center gap-2 transition hover:scale-105 hover:bg-black/90"
                >
                  Get Started for Free
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* 🔥 CINEMATIC SECTION */}
          <CinematicActionInline
            onStart={() => {
              if (!authUser) open("Auth");
              else window.location.href = "/dashboard";
            }}
          />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-white py-32 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Built for the speed of thought.
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Everything you need to capture and share your ideas without the bloat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "HD Camera",
                desc: "Studio quality facecam with smart lighting presets.",
              },
              {
                icon: Monitor,
                title: "Screen Capture",
                desc: "Record your entire screen or a single window.",
              },
              {
                icon: Zap,
                title: "Instant Sharing",
                desc: "Copy a link and share before you're done.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="rounded-3xl border p-8 hover:shadow-lg transition bg-white"
              >
                <div className="h-12 w-12 rounded-2xl bg-black/5 flex items-center justify-center mb-6">
                  <f.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
