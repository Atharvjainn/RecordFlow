"use client";

import {
  Monitor,
  Camera,
  Filter,
  LayoutGrid,
  List,
  Calendar
} from "lucide-react";
import { useEffect, useState } from "react";
import UploadVideoModal from "./UploadVideoModal";
import { useVideoStore } from "@/store/useVideoStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import RecordingModal from "./RecordModal";
import RecorderControls from "./RecorderControls";
import { startRecording } from "@/lib/recorder";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  // const videos = Array.from({ length: 6 });
  const [open,setOpen] = useState(false)
  const {Myvideos,getMyvideos,getAllVideos,AllVideos} = useVideoStore()
  const {authUser,isCheckingAuth} = useAuthStore()
  const [recordOpen,SetrecordOpen] = useState(false)
  const [showRecorder,setshowRecorder] = useState(false);
  const [recordedFile,setrecordedFile] = useState<File | null > (null);
  const [source, setSource] = useState("screen");
  const [activeTab, setActiveTab] = useState<"all" | "mine">("all")
  const videos = activeTab === "all" ? AllVideos : Myvideos


  const router = useRouter()

  useEffect(() => {
  if (!authUser || isCheckingAuth) return

  getMyvideos()
  getAllVideos()
}, [authUser?.id, isCheckingAuth])





  
  

  return (
    <main className="px-8 py-10">

      {showRecorder && <RecorderControls onFinish={(file) => {
        setrecordedFile(file)
        setOpen(true)
        setshowRecorder(false)
      }}/>}

      <RecordingModal isOpen={recordOpen} onClose={() => {SetrecordOpen(false)}} 
          onStop={(config) => {
            startRecording({mode : config.source,videoDeviceId : config.cameraDeviceId,audioDeviceId : config.cameraDeviceId
            })
            setshowRecorder(true)
          }}      
      />
      <UploadVideoModal isOpen={open} onClose={() => {
        setOpen(false)
        setrecordedFile(null)
        } } initialFile={recordedFile}/>
      {/* RECORD ACTIONS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-5 p-6 rounded-2xl bg-linear-to-br from-[#f2efff] to-[#f7f4ff] border cursor-pointer hover:shadow-md transition" onClick={() => SetrecordOpen(true)}>
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary to-secondary grid place-items-center text-white">
            <Monitor />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Record Screen</h3>
            <p className="text-slate-500 text-sm">
              Capture your screen or window
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 p-6 rounded-2xl bg-linear-to-br from-[#fff0f7] to-[#fff6fb] border cursor-pointer hover:shadow-md transition" onClick={() => setOpen(true)}>
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-secondary to-primary grid place-items-center text-white">
            <Camera />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Upload Video</h3>
            <p className="text-slate-500 text-sm">
             Upload Video
            </p>
          </div>
        </div>


        <div className="flex items-center gap-5 p-6 rounded-2xl bg-linear-to-br from-[#fff0f7] to-[#fff6fb] border cursor-pointer hover:shadow-md transition">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-secondary to-primary grid place-items-center text-white">
            <Camera />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Record Webcam</h3>
            <p className="text-slate-500 text-sm">
              Record from your camera
            </p>
          </div>
        </div>
      </section>

      {/* MY VIDEOS HEADER */}
      <section className="mt-12 flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-bold">
      {activeTab === "all" ? "All Videos" : "My Videos"}
    </h2>
    <p className="text-slate-500 text-sm">
      {activeTab === "all"
        ? `${AllVideos.length} videos`
        : `${Myvideos.length} videos`}
    </p>
  </div>

  {/* TABS */}
  <div className="flex items-center rounded-xl border p-1 bg-slate-100">
    <button
      onClick={() => setActiveTab("all")}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        activeTab === "all"
          ? "bg-white shadow"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      All Videos
    </button>

    <button
      onClick={() => setActiveTab("mine")}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        activeTab === "mine"
          ? "bg-white shadow"
          : "text-slate-500 hover:text-slate-700"
      }`}
    >
      My Videos
    </button>
  </div>
        </section>


      {/* VIDEO GRID */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {videos.map((video) => (
    <Link
      href={`/videos/${video.videoId}`}
      key={video.id}
      className="block"
    >
      <div className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition bg-white">
        {/* THUMBNAIL */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />

        {/* CONTENT */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold leading-snug line-clamp-2">
            {video.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={14} />
            <span>
              {new Date(video.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  ))}
      </section>

    </main>
  );
}
