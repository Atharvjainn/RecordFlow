
import { useAuthStore } from './useAuthStore'
import {create} from 'zustand'
import { getAllVideos, getVideosByid } from "@/lib/prisma/video"
import toast from 'react-hot-toast'

type VideoStore = {
    isvideosloading : boolean,
    getMyvideos : () => void,
    Myvideos : any[],
    getAllVideos : () => void,
    AllVideos : any[],
    deletevideo : (publicId : string) => void,
    isdeleting : boolean

}

export const useVideoStore = create<VideoStore>((set,get) =>({
    isvideosloading : false,
    isdeleting : false,
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
            set({isvideosloading : false})
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
            set({isvideosloading : true})
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
    }

}))