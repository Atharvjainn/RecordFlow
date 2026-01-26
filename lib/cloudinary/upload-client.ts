'use client';


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
    throw new Error("Upload failed");
  }

  return res.json()

};



  
