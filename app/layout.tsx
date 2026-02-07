import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { ToasterProvider } from "@/components/ToasterProvider";
import RecordingModal from "@/components/RecordModal";
import RecorderControls from "@/components/RecorderControls";
import AuthModal from "@/components/AuthModal";
import FancyFooter from "@/components/Footer";
import Loader from "@/components/Loader";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecordFlow",
  description: "Record, upload, and organize videos effortlessly",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
  className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-900 bg-[#f7f4ee] relative `}
>
  {/* Background glow */}
  <div className="pointer-events-none fixed inset-0 -z-10">
   
    <div className="absolute inset-0 bg-linear-to-b from-[#fde9e2] via-[#fbf7ef] to-[#fbf7ef]" />
    <div className="absolute top-[-35%] left-1/2 h-175 w-175 -translate-x-1/2 rounded-full bg-red-500/20 blur-[180px]" />
  </div>
  <Providers>{children}</Providers>

  {/* <Navbar /> */}
  {/* <Loader /> */}
  {/* <div className="mt-18">
    {children}
  </div> */}
  {/* <FancyFooter /> */}
  
  {/* <AuthModal /> */}
  <ToasterProvider />
</body>
    </html>
  );
}
