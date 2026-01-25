import { deleteFromCloudinary } from "@/lib/cloudinary/delete";
import { deleteVideoById } from "@/lib/prisma/video";


export async function DELETE(req : Request,{params} : {params : {videoId : string}}) {
    try {
        
        const {videoId} = await params;
        //delete from cloudinary
        const response = await deleteFromCloudinary(videoId)
        //delete from db
        const res = await deleteVideoById(videoId)
        return Response.json({success : true})

    } catch (error) {
        console.log("error in delete fn ",error)
        return new Response("Internal server error", { status: 500 });   
    }
    


}