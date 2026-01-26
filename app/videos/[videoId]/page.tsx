import VideoPage from "@/components/Videopage"
import { getVideoByid } from "@/lib/prisma/video"


type Params = {
  params: Promise<{
    videoId: string
  }>
}

const page = async ({ params }: Params) => {
  const { videoId } = await params

  const videoUrl = `https://res.cloudinary.com/dm9xxhm5b/video/upload/f_auto,q_auto,vc_auto/${videoId}`
  const video = await getVideoByid(videoId)

  if(!video) {
    return <div className="max-w-7xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-semibold text-gray-900">
        Video not found
      </h1>
      <p className="text-gray-600">
        The video you are looking for does not exist.
      </p>
    </div>
  }


  return (
    <VideoPage
      video={video}
      videoUrl={videoUrl}
    />
  )
}

export default page
