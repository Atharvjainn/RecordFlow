"use client";

import { useEffect, useState } from "react";
import {
  pauseRecording,
  resumeRecording,
  stopRecording,
} from "@/lib/recorder";
import { useUiStore } from "@/store/useUiStore";
import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play, Square, Loader2 } from "lucide-react";

export default function RecorderControls() {
  const {
    RecordControls,
    closeRecordControls,
    addFile,
    open,
  } = useUiStore();

  const [state, setState] = useState<
    "recording" | "paused" | "saving"
  >("recording");

  useEffect(() => {
    setState("recording");
  }, []);

  const handleStop = async () => {
    setState("saving");
    const file = await stopRecording();
    addFile(file);
    open("Upload");
    closeRecordControls();
  };

  return (
    <AnimatePresence>
      {RecordControls && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
        >
          <div className="flex items-center gap-3 rounded-full bg-black px-4 py-3 shadow-xl">
            {/* RECORDING INDICATOR */}
            {state !== "saving" && (
              <div className="flex items-center gap-2 pr-2 border-r border-white/10">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
                </span>
                <span className="text-xs font-medium text-white">
                  {state === "paused" ? "Paused" : "Recording"}
                </span>
              </div>
            )}

            {/* ACTIONS */}
            {state === "recording" && (
              <>
                <button
                  onClick={() => {
                    pauseRecording();
                    setState("paused");
                  }}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
                >
                  <Pause size={14} />
                  Pause
                </button>

                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                >
                  <Square size={14} />
                  Stop
                </button>
              </>
            )}

            {state === "paused" && (
              <>
                <button
                  onClick={() => {
                    resumeRecording();
                    setState("recording");
                  }}
                  className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
                >
                  <Play size={14} />
                  Resume
                </button>

                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                >
                  <Square size={14} />
                  Stop
                </button>
              </>
            )}

            {state === "saving" && (
              <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
