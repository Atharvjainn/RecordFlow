"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import {
  Camera,
  Monitor,
  Video,
  ChevronRight,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import Loader from "./Loader";

export default function LandingPage() {
  
  return (
    <div className="min-h-screen bg-[#fbf7ef]">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-linear-to-b from-[#fde9e2] via-[#fbf7ef] to-[#fbf7ef]" />
        <div className="absolute top-[-35%] left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-red-500/20 blur-[180px]" />

        {/* Content */}
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

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/dashboard">
                <button className="h-14 px-8 rounded-2xl bg-black text-white text-lg font-semibold flex items-center gap-2 hover:bg-black/90 transition">
                  Get Started for Free
                  <ChevronRight className="h-5 w-5" />
                </button>
              </Link>

              <button className="h-14 px-8 rounded-2xl border border-black/20 bg-white/60 text-lg font-medium flex items-center gap-2 hover:bg-white transition">
                Watch Demo
                <Play className="h-5 w-5 fill-current" />
              </button>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-20 mx-auto max-w-4xl"
          >
            <div className="overflow-hidden rounded-[2.5rem] border bg-white shadow-xl">
              <div className="aspect-16/10 bg-black flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                  <Play className="h-10 w-10 text-white fill-white" />
                </div>
              </div>
            </div>
          </motion.div>
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

      {/* ================= SOCIAL PROOF ================= */}
      <section className="py-32 px-6">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              Join 10,000+ creators shipping daily.
            </h2>

            <div className="space-y-6">
              {[
                "Zero setup required, record from your browser.",
                "Cloud storage included.",
                "Privacy first: your recordings, your rules.",
                "Custom branding on share pages.",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <CheckCircle2 className="h-5 w-5 text-red-600" />
                  <p className="font-medium">{text}</p>
                </div>
              ))}
            </div>

            <Link href="/dashboard">
              <button className="mt-12 h-14 px-8 rounded-2xl bg-black text-white text-lg font-semibold hover:bg-black/90 transition">
                Start Recording Today
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: "99.9%", sub: "Uptime SLA" },
              { icon: Users, label: "10k+", sub: "Active Users" },
              { icon: Zap, label: "0ms", sub: "Latency" },
              { icon: Video, label: "1M+", sub: "Clips Captured" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`rounded-3xl border bg-white p-6 text-center ${
                  i % 2 === 1 ? "mt-8" : ""
                }`}
              >
                <stat.icon className="h-10 w-10 text-red-600 mx-auto mb-4" />
                <div className="text-2xl font-bold">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
