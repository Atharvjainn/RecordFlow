'use client'
import { useUiStore } from "@/store/useUiStore";
import { Camera, Monitor, Upload, Play } from "lucide-react";

export default function DashboardHero() {
    const {activeModal,open,close} = useUiStore()



  return (
    <section className="max-w-7xl mx-auto px-6 mt-10">
      <div className="relative rounded-3xl bg-white/80 backdrop-blur-md border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-8">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-black">
              Record bold clips. Ship faster.
            </h1>
            <p className="mt-3 max-w-xl text-base text-black/60">
              A creator-first workspace for high-contrast recordings—camera,
              screen, and quick uploads.
            </p>

            {/* Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["HD presets", "Smart shortcuts", "Clean library"].map(
                (label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 text-sm text-black/70"
                  >
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {label}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="hidden sm:block rounded-2xl border border-black/5 bg-white px-6 py-5 shadow-sm">
            <p className="text-sm text-black/50">This week</p>
            <p className="mt-1 text-3xl font-semibold text-black">12</p>
            <p className="text-sm text-black/50">clips recorded</p>
            <div className="mt-4 flex items-center gap-2 text-sm text-black/50">
              <Play size={16} />
              Tap a card to preview
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 rounded-xl bg-black px-6 py-5 text-white text-base font-medium transition hover:bg-black/90 cursor-pointer"
            onClick={() =>{
                console.log("OPEN CLICKED");
            console.log(activeModal)
             open("Recorder")
             console.log(activeModal)
            }}
            >
              <Camera size={18} />
              Record Camera
            </button>

            <button className="flex items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-5 text-white text-base font-medium transition hover:bg-red-700 cursor-pointer"
            onClick={() => open("Recorder")}
            >
              <Monitor size={18} />
              Record Screen
            </button>
          </div>

          <button className="flex items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-6 py-5 text-black font-medium transition hover:bg-black/5 cursor-pointer"
          onClick={() => open('Upload')}
          >
            <Upload size={18} />
            Upload video
          </button>
        </div>
      </div>
    </section>
  );
}
