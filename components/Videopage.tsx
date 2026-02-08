"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Trash2, Link as LinkIcon } from "lucide-react";
import { VideoWithUser } from "@/lib/types";
import { useAuthStore } from "@/store/useAuthStore";
import { copylink } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { updateVideoById } from "@/lib/prisma/video";
import { useVideoStore } from "@/store/useVideoStore";
import Link from "next/link";

type VideoPageProps = {
  video: VideoWithUser;
  videoUrl: string;
};

export default function VideoPage({ video, videoUrl }: VideoPageProps) {
  const { authUser } = useAuthStore();
  const { deletevideo } = useVideoStore();
  const uploader = video.user;
  const router = useRouter();

  const [visibility, setVisibility] =
    useState<"public" | "private">(video.visibility);
  const [showVisibility, setShowVisibility] = useState(false);

  const deleteVideo = async () => {
    deletevideo(video.videoId);
    router.push("/dashboard");
  };

  const visibilityHandler = async (next: "public" | "private") => {
    setVisibility(next);
    await updateVideoById(video.videoId, next);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 py-8 space-y-10 font-body"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          <h1 className="text-3xl font-heading font-semibold tracking-tight text-black">
            {video.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Link
              href={`/users/${uploader.id}`}
              className="flex items-center gap-2 hover:opacity-90 transition"
            >
              <img
                src={uploader?.image as string}
                alt={uploader?.name ?? "User"}
                className="w-9 h-9 rounded-full ring-1 ring-black/10"
                referrerPolicy="no-referrer"
              />
              <span className="font-medium text-black">
                {uploader?.name ?? "Unknown user"}
              </span>
            </Link>
          </div>

          {video.description && (
            <p className="text-[15px] leading-relaxed text-slate-600 max-w-3xl">
              {video.description}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={copylink}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5 transition cursor-pointer"
          >
            <LinkIcon size={14} />
            Copy link
          </button>

          {authUser?.id === uploader.id && (
            <>
              <button
                onClick={deleteVideo}
                className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition cursor-pointer"
              >
                <Trash2 size={14} />
                Delete
              </button>

              {/* VISIBILITY */}
              <div className="relative">
                <button
                  onClick={() => setShowVisibility((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5 transition cursor-pointer"
                >
                  <Eye size={14} />
                  {visibility.charAt(0).toUpperCase() +
                    visibility.slice(1)}
                </button>

                <AnimatePresence>
                  {showVisibility && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-36 rounded-xl border bg-white shadow-lg z-20 overflow-hidden"
                    >
                      {(["public", "private"] as const).map(
                        (option) => (
                          <button
                            key={option}
                            onClick={() => {
                              visibilityHandler(option);
                              setShowVisibility(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm transition ${
                              visibility === option
                                ? "bg-black text-white"
                                : "text-slate-700 hover:bg-black/5"
                            }`}
                          >
                            {option.charAt(0).toUpperCase() +
                              option.slice(1)}
                          </button>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </div>

      {/* VIDEO PLAYER */}
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-3xl overflow-hidden bg-black shadow-2xl"
      >
        <video
          src={video.videoUrl}
          controls
          playsInline
          preload="metadata"
          className="w-full h-full object-contain"
        />
        
      </motion.div>
    </motion.div>
  );
}
