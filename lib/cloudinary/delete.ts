import crypto from 'crypto'

export const deleteFromCloudinary = async(publicId : string) => {
    const timestamp = Math.floor(Date.now()/1000);
         const signature = crypto
            .createHash("sha1")
            .update(
            `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`
            )
            .digest("hex");
    
        const cloudinaryForm = new FormData()
        cloudinaryForm.append("public_id", publicId);
        cloudinaryForm.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        cloudinaryForm.append("timestamp", timestamp.toString());
        cloudinaryForm.append("signature", signature);
    
    
        const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/destroy`,
            {
                method : "POST",
                body : cloudinaryForm
            }
        );
    
        const data = await res.json();
        
         if (!res.ok || (data.result !== "ok" && data.result !== "not found")) {
            console.error("Cloudinary signed delete failed:", data);
            throw new Error("Cloudinary signed delete failed");
        }
        return data
}