"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import Navbar from "@/components/Navbar";
import Loader from "@/components/Loader";
import FancyFooter from "@/components/Footer";
import RecordingModal from "@/components/RecordModal";
import UploadVideoModal from "@/components/UploadVideoModal";
import RecorderControls from "@/components/RecorderControls";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkauth, isCheckingAuth,hasCheckedAuth } = useAuthStore();

  useEffect(() => {
    if(!hasCheckedAuth) checkauth();
  }, [checkauth,hasCheckedAuth]);

  if (isCheckingAuth && !hasCheckedAuth) {
    return <Loader />;
  }

  return (
    <>
      <Navbar />
      <RecordingModal />
      <UploadVideoModal />
      <RecorderControls />
      <div className="mt-18  min-h-screen">
        {children}
      </div>
      
      <FancyFooter />
    </>
  );
}
