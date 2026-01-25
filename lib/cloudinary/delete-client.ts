'use client'

export const deleteVideo = async(publicId : string) => {
    if(!publicId) throw new Error('Public Id is missing!')
    
    //api call
    const res = await fetch(`/api/videos/${publicId}`,{
        method : "DELETE"
    })

    if (!res.ok) {
    const text = await res.text();
    console.error("Delete-video response:", text);
    throw new Error("Delete failed");

  }

    console.log(res);
    
}