
import { useAuthStore } from './useAuthStore'
import {create} from 'zustand'
import { getAllVideos, getVideosByid } from "@/lib/prisma/video"

type VideoStore = {
    isvideosloading : boolean,
    getMyvideos : () => void,
    Myvideos : any[],
    getAllVideos : () => void,
    AllVideos : any[],

}

export const useVideoStore = create<VideoStore>((set,get) =>({
    isvideosloading : false,
    Myvideos : [],
    AllVideos : [],

    getMyvideos : async () => {
        set({isvideosloading : true})
        try {
            const user = useAuthStore.getState().authUser
            console.log(user);
            
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
            const response = await getAllVideos();
            set({AllVideos : response})
        } catch (error) {
            console.log("error in fetching all the videos",error);
        } finally {
            set({isvideosloading : true})
        }
    }

}))