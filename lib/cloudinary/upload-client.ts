'use client';

import toast from "react-hot-toast";


type uploadClientVideoProps = {
  file : File,
  title : string,
  description : string,
  visibility : 'public' | 'private'
}

export const uploadVideoClient = async ({file,title,description,visibility} : uploadClientVideoProps) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("description", description);
  formData.append("visibility", visibility);

  const res = await fetch("/api/videos", {
    method: "POST",
    body: formData,
  });



  if (!res.ok) {
    const text = await res.text();
    console.error("Upload-video response:", text);
    toast.error("Cannot Upload...")
    throw new Error("Upload failed");
  }

  toast.success("Video Uploaded Successfully!")
  return res.json()

};



  
