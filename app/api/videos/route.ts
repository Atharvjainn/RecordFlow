
import { getcurrentUser } from "@/lib/actions/auth-actions"
import { UploadVideoToCloudinary } from "@/lib/cloudinary/upload"
import { uploadVideoToPrisma } from "@/lib/prisma/video"
import { Visibility } from "@/lib/types"
import { randomUUID } from "crypto"



export async function POST(req : Request){
    try {
        const body = await req.formData()
        const title = body.get('title')
        const file = body.get('file')
        const description = body.get('description')
        const rawVisibility = body.get('visibility')
        const visibility: Visibility =
            rawVisibility === "public" || rawVisibility === "private"
                ? rawVisibility
                : "private"; // fallback
        const user = await getcurrentUser();
        if(!user) throw new Error("User is not authenticated!!")

        //upload to cloudinary
        const response = await UploadVideoToCloudinary(file as Blob)

        //upload to db
        const Id = randomUUID()
        const thumbnailUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/so_1/${response.public_id}.jpg`;

        await uploadVideoToPrisma({
            id : Id,
            title : title as string,
            description : description as string,
            videoUrl : response.secure_url,
            videoId : response.public_id,
            duration : response.duration,
            visibility : visibility,
            thumbnailUrl : thumbnailUrl,
            userId : user.id
        })

        return Response.json({success : true})

    } catch (error) {
        console.error("Error in uploading the video", error);
        return new Response("Internal server error", { status: 500 });   
    }
}