'use client'

import { useState } from 'react'
import {  VideoWithUser } from '@/lib/types'
import { useAuthStore } from '@/store/useAuthStore'
import { copylink } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { updateVideoById } from '@/lib/prisma/video'
import { useVideoStore } from '@/store/useVideoStore'
import Link from 'next/link'

const TABS = ['Transcript', 'Metadata', 'Viewers', 'Chapters'] as const

type VideoPageProps = {
  video: VideoWithUser
  videoUrl: string
}

const VideoPage = ({ video, videoUrl  }: VideoPageProps) => {
  
  const { authUser } = useAuthStore()
  const {deletevideo,isdeleting} = useVideoStore()
  const uploaderuser = video.user
  console.log(uploaderuser?.image)


  const [visibility, setVisibility] =
    useState<'public' | 'private'>(video.visibility)

  const [showVisibility, setShowVisibility] = useState(false)
  const router = useRouter()

  const deleteVideo = async() => {
     deletevideo(video.videoId)
    router.push('/dashboard')
  }

  const visibilityhandler = async(next : "public" | "private") => {
      await updateVideoById(video.videoId,next)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            {video.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Link href={`/users/${uploaderuser.id}`} className='flex items-center gap-2'>
            <img
              src={uploaderuser?.image as string}
              alt={uploaderuser?.name ?? 'User'}
              className="w-8 h-8 rounded-full"
              referrerPolicy="no-referrer"
            />
            <span className="font-medium text-gray-700">
              {uploaderuser?.name ?? 'Unknown user'}
            </span>
            </Link>
          </div>

          <p className="text-gray-600 max-w-3xl">
            {video.description}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-md border text-sm text-gray-600 hover:bg-gray-50"
            onClick={copylink}
          >
            Copy link
          </button>

          {authUser?.id===uploaderuser.id &&
          <>
          <button className="px-3 py-2 rounded-md border text-sm text-red-500 hover:bg-red-50"
            onClick={deleteVideo}
          >
            Delete video
          </button>

          <div className="relative">
            <button
              onClick={() => setShowVisibility(prev => !prev)}
              className="px-3 py-2 rounded-md border text-sm flex items-center gap-2 cursor-pointer"
            >
              👁 {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
            </button>

            {showVisibility && (
              <div className="absolute right-0 mt-2 w-32 rounded-md border bg-white shadow-lg z-10">
                {['public', 'private'].map(option => (
                  <button
                    key={option}
                    onClick={async() => {
                       const next = option as 'public' | 'private'
                      setVisibility(next)
                      await visibilityhandler(next)
                      setShowVisibility(false)
                    }}
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                      (visibility) === option
                        ? 'text-pink-600 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          </>
          
          }

        
          
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div >

        {/* VIDEO */}
        <div className="rounded-xl overflow-hidden bg-black">
          <video
            src={videoUrl}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          />
        </div>

        {/* RIGHT PANEL */}
        {/* <div className="rounded-xl border bg-white flex flex-col h-130"> */}

          {/* TABS */}
          {/* <div className="flex border-b">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'text-pink-600 border-b-2 border-pink-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div> */}

          {/* TAB CONTENT */}
          {/* <div className="flex-1 overflow-y-auto p-4 text-sm text-gray-500">
            {activeTab} content goes here
          </div> */}
        {/* </div> */}
      </div>
    </div>
  )
}

export default VideoPage
