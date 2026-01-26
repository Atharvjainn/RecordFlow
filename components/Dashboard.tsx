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
  const {videos,getvideos} = useVideoStore()
  const {authUser,isCheckingAuth} = useAuthStore()
  const [recordOpen,SetrecordOpen] = useState(false)
  const [showRecorder,setshowRecorder] = useState(false);
  const [recordedFile,setrecordedFile] = useState<File | null > (null);
  const [source, setSource] = useState("screen");
  const router = useRouter()

  useEffect(() => {
    if(authUser && !isCheckingAuth)  getvideos()
  },[getvideos,authUser,isCheckingAuth,open])




  
  

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
          <h2 className="text-2xl font-bold">My Videos</h2>
          <p className="text-slate-500 text-sm">6 videos</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm">
            <Filter size={16} />
            Filter
          </button>

          <button className="p-2 rounded-xl border bg-primary text-white">
            <LayoutGrid size={18} />
          </button>

          <button className="p-2 rounded-xl border text-slate-500">
            <List size={18} />
          </button>
        </div>
      </section>

      {/* VIDEO GRID */}
      <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, i) => (
          <Link href={`/${video.videoId}`} key={video.id} className="block">
          <div
            key={i}
            className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition bg-white"
          >
            {/* THUMBNAIL */}
            
              <img src={video.thumbnailUrl} className="relative" alt="" />
              {/* <span className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/80 text-white text-xs">
                <Clock size={12} />
                {["5:32", "45:18", "12:05", "8:20", "6:42", "9:10"][i]}
              </span> */}
            

            {/* CONTENT */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold leading-snug">
                {video.title}
              </h3>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar size={14} />
                {[
                  "Jan 15, 2024",
                  "Jan 12, 2024",
                  "Jan 10, 2024",
                  "Jan 8, 2024",
                  "Jan 6, 2024",
                  "Jan 3, 2024",
                ][i]}
              </div>
            </div>
          </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
