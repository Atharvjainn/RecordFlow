import PublicProfilePage from "@/components/PublicProfilePage";
import { getUserbyId } from "@/lib/prisma/user";
import { getVideosForPublicById } from "@/lib/prisma/video";

type Params = {
    params : Promise <{userId : string}>
}

const page = async ({params} : Params) => {
    const { userId } = await params;
    const user = await getUserbyId(userId as string)
    const videos = await getVideosForPublicById(userId as string)

    if(!user) {
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
    <PublicProfilePage user={user} videos={videos}/>
  )
    
}

export default page