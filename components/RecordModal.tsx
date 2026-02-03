"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Select } from "./Select";
import { useUiStore } from "@/store/useUiStore";
import { startRecording } from "@/lib/recorder";

// type RecordModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onStop: (config: {
//     source: "camera" | "screen" | "screen+camera";
//     cameraDeviceId?: string;
//     micDeviceId?: string;
//   }) => void;
// };

const SOURCE_OPTIONS = [
  "camera",
  "screen",
];

export default function RecordingModal() {
  const {open,close,activeModal,RecordControls,closeRecordControls,openRecordControls} = useUiStore()
  console.log(activeModal)
  const [source, setSource] = useState("screen");
  const [camera, setCamera] = useState("");
  const [mic, setMic] = useState("");

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);

  // 🔍 Fetch devices
  const fetchDevices = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

    const devices = await navigator.mediaDevices.enumerateDevices();
    setCameras(devices.filter(d => d.kind === "videoinput"));
    setMics(devices.filter(d => d.kind === "audioinput"));
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  // ⌨️ ESC key close
  useEffect(() => {
    if (!activeModal) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [activeModal]);

  const cameraOptions = cameras.map(c => c.label || "Camera");
  const micOptions = mics.map(m => m.label || "Microphone");

  const selectedCamera = cameras.find(c => c.label === camera);
  const selectedMic = mics.find(m => m.label === mic);


  return (
    
    // 🌑 BACKDROP
    <div
      onClick={() => close()}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
        activeModal=="Recorder" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 🪟 MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-105 rounded-2xl bg-white p-6 shadow-xl animate-in fade-in zoom-in-95"
      >
        {/* ❌ Close Button */}
        <button
          onClick={() => close()}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <h3 className="mb-4 text-sm font-semibold text-gray-700">
          Video settings
        </h3>

        {/* Source */}
        <Select
          label="Screen and Camera"
          value={source}
          options={SOURCE_OPTIONS}
          onChange={setSource}
        />

        {/* Camera */}
        <Select
          label="Camera"
          value={camera}
          options={cameraOptions}
          onChange={setCamera}
        />

        {/* Microphone */}
        <Select
          label="Microphone"
          value={mic}
          options={micOptions}
          onChange={setMic}
          highlight="pink"
        />

        {/* Action Button */}
        <button
          className="mt-6 w-full rounded-lg bg-pink-500 py-3 text-sm font-medium text-white hover:bg-pink-600 transition"
          // onClick={() => {
          //   onStop({
          //   source: source as "camera" | "screen" | "screen+camera",
          //   cameraDeviceId: selectedCamera?.deviceId,
          //   micDeviceId: selectedMic?.deviceId,
          // });  
          //   close();  // close modal
          // }}
          onClick={() => {
            startRecording({mode : source as 'camera' | 'screen',videoDeviceId : selectedCamera?.deviceId,audioDeviceId : selectedMic?.deviceId})
            openRecordControls()
            close()
          }}
        >
          Start Recording
        </button>
      </div>
    </div>
  );
}


