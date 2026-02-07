"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Select } from "./Select";
import { useUiStore } from "@/store/useUiStore";
import { startRecording } from "@/lib/recorder";
import { motion, AnimatePresence } from "framer-motion";

const SOURCE_OPTIONS = ["camera", "screen"];

export default function RecordingModal() {
  const { close, activeModal, openRecordControls } = useUiStore();

  const [source, setSource] = useState<"camera" | "screen">("screen");
  const [camera, setCamera] = useState("");
  const [mic, setMic] = useState("");

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);

  // Fetch devices
  useEffect(() => {
    const fetchDevices = async () => {
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((d) => d.kind === "videoinput"));
      setMics(devices.filter((d) => d.kind === "audioinput"));
    };
    fetchDevices();
  }, []);

  // ESC handling
  useEffect(() => {
    if (activeModal !== "Recorder") return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [activeModal, close]);

  const cameraOptions = cameras.map((c) => c.label || "Camera");
  const micOptions = mics.map((m) => m.label || "Microphone");

  const selectedCamera = cameras.find((c) => c.label === camera);
  const selectedMic = mics.find((m) => m.label === mic);

  return (
    <AnimatePresence mode="wait">
      {activeModal === "Recorder" && (
        <motion.div
          key="recording-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={close}
        >
          <motion.div
            key="recording-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 26,
            }}
            className="relative w-[420px] rounded-3xl bg-[#fbf7ef] p-6 shadow-2xl"
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-black/5"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <h3 className="mb-6 text-sm font-semibold text-black">
              Recording settings
            </h3>

            <Select
              label="Recording source"
              value={source}
              options={SOURCE_OPTIONS}
              onChange={(v) => setSource(v as "camera" | "screen")}
            />

            <Select
              label="Camera"
              value={camera}
              options={cameraOptions}
              onChange={setCamera}
            />

            <Select
              label="Microphone"
              value={mic}
              options={micOptions}
              onChange={setMic}
            />

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-6 w-full rounded-full bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700"
              onClick={() => {
                startRecording({
                  mode: source,
                  videoDeviceId: selectedCamera?.deviceId,
                  audioDeviceId: selectedMic?.deviceId,
                });
                openRecordControls();
                close();
              }}
            >
              Start recording
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
