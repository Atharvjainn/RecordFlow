"use client";

import { Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useVideoStore } from "@/store/useVideoStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import Hero from "./Hero";
import { formatDuration } from "@/lib/utils";
import { useUiStore } from "@/store/useUiStore";
import { VideoSkeleton } from "./VideoSkeleton";
import Loader from "./Loader";

export default function Dashboard() {
  const { open } = useUiStore();
  const {
    Myvideos,
    getMyvideos,
    getAllVideos,
    AllVideos,
    isdeleting,
    isuploading,
    isvideosloading,
  } = useVideoStore();
  const { authUser, isCheckingAuth } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"all" | "mine">("all");
  const videos = activeTab === "all" ? AllVideos : Myvideos;
  const [hasloaded,sethasloaded] = useState(false)



  useEffect(() => {
    if (!authUser || isCheckingAuth) return;
    Promise.all([
    getMyvideos(),
    getAllVideos(),
  ]).finally(() => {
    sethasloaded(true);
  });
  }, [authUser?.id, isCheckingAuth, isdeleting, isuploading]);

  if(isdeleting) return <Loader />

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="px-8 py-10"
    >
      <Hero />

      {/* HEADER */}
      <section className="mt-12 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {activeTab === "all" ? "All Videos" : "My Videos"}
          </h2>
          <p className="text-slate-500 text-sm">
            {videos.length} videos
          </p>
        </div>

        {/* TABS */}
        <div className="flex items-center rounded-full border border-black/10 bg-white/70 backdrop-blur px-1 py-1 shadow-sm">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "all"
                ? "bg-black text-white shadow"
                : "text-slate-600 hover:text-black"
            }`}
          >
            All Videos
          </button>
          <button
            onClick={() => setActiveTab("mine")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === "mine"
                ? "bg-black text-white shadow"
                : "text-slate-600 hover:text-black"
            }`}
          >
            My Videos
          </button>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mt-6">
        {isvideosloading || !hasloaded  ? (
          /* 🔄 LOADING */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <VideoSkeleton key={i} />
            ))}
          </div>
        ) : videos.length === 0 ? (
          /* 🚫 EMPTY */
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-black/10 bg-white py-20 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5">
              <Monitor className="h-8 w-8 text-red-600" />
            </div>

            <h3 className="text-lg font-semibold text-black">
              No videos yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              {activeTab === "mine"
                ? "You haven’t recorded or uploaded any videos yet."
                : "There are no videos to show right now."}
            </p>

            <button
              onClick={() => open("Recorder")}
              className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-black/90 transition"
            >
              Record your first video
            </button>
          </motion.div>
        ) : (
          /* 🎬 VIDEOS */
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: 0.06 },
              },
            }}
          >
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Link
                  href={`/videos/${video.videoId}`}
                  className="group block"
                >
                  <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition">
                    <div className="relative aspect-video bg-black">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="h-full w-full object-cover opacity-90"
                      />

                      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

                      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs text-white">
                        <span className="h-2 w-2 rounded-full bg-red-500" />
                        <span>
                          {formatDuration(video.duration) ?? "00:00"}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold leading-snug line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {video.visibility?.[0].toUpperCase() +
                          video.visibility.slice(1)}{" "}
                        • 1080p
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </motion.main>
  );
}
