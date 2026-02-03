'use client';

import { uploadVideoClient } from "@/lib/cloudinary/upload-client";
import { useUiStore } from "@/store/useUiStore";
import React, { useState,useEffect } from "react";

type UploadVideoModalProps = {
  onClose: () => void;
  initialFile : File | null
};

export default function UploadVideoModal({
  onClose,
  initialFile
}: UploadVideoModalProps) {
  
    const {activeModal} = useUiStore()
    const [title,setTitle] = useState<string>("")
    const [description,setDescription] = useState<string>("")
    const [visibility,setVisibility] = useState<'public' | 'private'> ("private")
    const [file,setFile] = useState < null | File >(null)

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        if(!file){
            alert("Please select a video file to upload.")
            return
        }
        // const extra = await uploadVideoToCloudinary(file)
        // const res = await fetch('/api/videos', {
        // method: 'POST',
        // headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({
        //   title,
        //   description,
        //   visibility,
        //   extra: extra,
        // }),

        const res = await uploadVideoClient({file,title,description,visibility})
        // });
        
        

        onClose();
    }

    useEffect(() => {
    if (initialFile) {
      setFile(initialFile);

      // Optional smart defaults
      setTitle("Screen recording");
      setDescription("Recorded using the built-in recorder");
    }
  }, [initialFile]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40
    ${activeModal=="Upload" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
    `}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Upload Video
          </h2>
          <p className="text-sm text-gray-500">
            Add details and control visibility
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Video */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video File
            </label>
            {file ?  <div className="text-sm text-gray-600">
                      Selected file: <strong>{file.name}</strong>
                    </div> 
                    : 
                     <input
                      type="file"
                      accept="video/*"
                      className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0
                        file:bg-linear-to-r file:from-purple-500 file:to-pink-500
                        file:px-4 file:py-2 file:text-white hover:file:opacity-90"
                      required
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFile(file || null)
                      }}
                    />
                    
                    }
           
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              className="w-full rounded-xl border border-gray-200 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Add a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2
                focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibility
            </label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  
                  className="accent-purple-500"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                />
                <span className="text-sm">Public</span>
              </label>

              <label className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  className="accent-purple-500"
                  checked={visibility === 'private'}
                  onChange={() => setVisibility('private')} 
                />
                <span className="text-sm">Private</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-linear-to-r from-purple-500 to-pink-500
                px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Upload Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
