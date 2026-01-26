'use server'

import { prisma } from "../prisma"
import { Video } from "../types"

export const uploadVideoToPrisma = async(data : Video) => {
    try {
        const video = await prisma.video.create({data})
        return video
    } catch (error) {
        console.error("Prisma upload video error:", error);
        throw error
    } 
}

export const getVideosByid = async (userId : string) => {
    try {
        const videos = await prisma.video.findMany({
            where : {
                userId : userId
            }
        })
        return videos;
    } catch (error) {
        console.error("Prisma fetch video error:", error);
        throw error
    }
}


export const getVideoByid = async (videoId : string) => {
    try {
        const video = await prisma.video.findFirst({
            where : {
                videoId : videoId
            },
            select : {
                id : true,
                title : true,
                description : true,
                visibility : true,
                videoId : true,
                user : {
                    select : {
                        id : true,
                        name : true,
                        image : true
                    }
                }
            }
        })

        if(!video) throw new Error("cannot find this video")
        return video
    } catch (error) {
        console.error("Prisma fetch video error:", error);
        throw error
    }
}


export const deleteVideoById = async(publicId : string) => {
    try {
       const response = await prisma.video.delete({
        where : {
            videoId : publicId,
        }
       })  
       return response;
    } catch (error) {
        console.error("Prisma delete video error:", error);
        throw error
    }
}


export const getAllVideos = async () => {
    try {
        const response = await prisma.video.findMany()
        return response;
    } catch (error) {
        console.error("Prisma delete video error:", error);
        throw error
    }
}


export const updateVideoById = async (videoId : string,visibility : 'public' | 'private') => {
    try {
        const response = await prisma.video.update({
            where : {
                videoId : videoId
            },
            data : {
                visibility : visibility
            }
        }) 
        return response
    } catch (error) {
        console.error("Prisma delete video error:", error);
        throw error
    }
}