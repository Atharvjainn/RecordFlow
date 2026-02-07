
import { useAuthStore } from './useAuthStore'
import {create} from 'zustand'
import { getAllVideos, getVideosByid } from "@/lib/prisma/video"
import toast from 'react-hot-toast'

type uploadClientVideoProps = {
  file : File,
  title : string,
  description : string,
  visibility : 'public' | 'private'
}

type VideoStore = {
    isvideosloading : boolean,
    getMyvideos : () => void,
    Myvideos : any[],
    getAllVideos : () => void,
    AllVideos : any[],
    deletevideo : (publicId : string) => void,
    isdeleting : boolean
    uploadVideo : (data : uploadClientVideoProps ) => void,
    isuploading : boolean,

}

export const useVideoStore = create<VideoStore>((set,get) =>({
    isvideosloading : true,
    isdeleting : false,
    isuploading : false,
    Myvideos : [],
    AllVideos : [],

    getMyvideos : async () => {
        set({isvideosloading : true})
        try {
            const user = useAuthStore.getState().authUser
            if(!user){
                console.log("Unauthorised User")
                throw new Error("Unauthorised User")
            }
            const videos = await getVideosByid(user.id)
            set({Myvideos : videos})
        } catch (error) {
            console.log("error in fetching videos",error);
        } finally {
            set({
                isvideosloading : false,
                
            })
        }
    },

    getAllVideos : async() => {
        set({isvideosloading : true})
        try {
            const authUser = useAuthStore.getState().authUser
            const response = await getAllVideos(authUser?.id!);
            set({AllVideos : response})
        } catch (error) {
            console.log("error in fetching all the videos",error);
        } finally {
            set({
                isvideosloading : false,
               
            })
        }
    },

    deletevideo : async(publicId : string) => {
        set({isdeleting : true})
        try {
            if(!publicId) throw new Error('Public Id is missing!')
            const res = await fetch(`/api/videos/${publicId}`,{
                    method : "DELETE"
            })

            if(!res.ok) throw new Error(`error in deleting the video.. ${res.status}`)
            toast.success("Video Deleted Successfully!!")
            
        } catch (error) {
            console.log(error)
            toast.error("cannot delete..")
        } finally {
            set({isdeleting : false})
        }
    },

    uploadVideo : async(data : uploadClientVideoProps) => {
        set({isuploading : true})
        try {
            const {file,title,description,visibility} = data
            const formdata = new FormData()
            formdata.append("file",file)
            formdata.append("title", title);
            formdata.append("description", description);
            formdata.append("visibility", visibility);

            const res = await fetch("/api/videos", {
              method: "POST",
              body: formdata,
            });

            toast.success("Video Uploaded Successfully!!")
        } catch (error) {
            console.log(error)
            toast.error("Cannot upload!!")
        }finally {
            set({isuploading : false})
        }
    }

    

}))