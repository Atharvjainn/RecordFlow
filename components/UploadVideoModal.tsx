'use client';
import { useUiStore } from "@/store/useUiStore";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderIcon, Upload, X } from "lucide-react";
import { useVideoStore } from "@/store/useVideoStore";

export default function UploadVideoModal() {
  const { activeModal, close, initialFile } = useUiStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<'public' | 'private'>("private");
  const [file, setFile] = useState<File | null>(null);

  const {uploadVideo,isuploading} = useVideoStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a video file to upload.");
      return;
    }

    await uploadVideo({ file, title, description, visibility });
    close();
  };

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      setTitle("Screen recording");
      setDescription("Recorded using the built-in recorder");
    }
  }, [initialFile]);

  return (
    <AnimatePresence>
      {activeModal === "Upload" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-xl rounded-3xl bg-[#fbf7ef] p-8 shadow-2xl"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-black">
                Upload video
              </h2>
              <button
                onClick={close}
                className="rounded-full p-1 hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DROP ZONE */}
              <motion.label
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/20 bg-white/60 px-6 py-10 text-center cursor-pointer transition hover:bg-white"
              >
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />

                <div className="h-12 w-12 rounded-xl bg-black flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-white" />
                </div>

                {file ? (
                  <p className="text-sm text-black">
                    <strong>{file.name}</strong>
                  </p>
                ) : (
                  <>
                    <p className="font-medium text-black">
                      Drag & drop your file
                    </p>
                    <p className="text-sm text-black/60">
                      or click to choose a video
                    </p>
                  </>
                )}
              </motion.label>

              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="New Recording"
                  className="w-full rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Recorded with RecordFlow"
                  className="w-full rounded-xl border border-black/20 px-4 py-3 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                />
              </div>

              {/* VISIBILITY */}
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Visibility
                </label>
                <div className="flex gap-3">
                  {["private", "public"].map((v) => (
                    <label
                      key={v}
                      className="flex items-center gap-2 rounded-xl border border-black/20 px-4 py-2 cursor-pointer text-sm"
                    >
                      <input
                        type="radio"
                        checked={visibility === v}
                        onChange={() => setVisibility(v as any)}
                        className="accent-red-600"
                      />
                      {v[0].toUpperCase() + v.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-full border border-black/20 px-5 py-2 text-sm hover:bg-black/5"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 flex justify-between items-center"
                >
                  {isuploading ? <div className="animate-spin flex flex-1 px-6"><LoaderIcon/></div> : "Start upload"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
