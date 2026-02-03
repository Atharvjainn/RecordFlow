import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { ToasterProvider } from "@/components/ToasterProvider";
import RecordingModal from "@/components/RecordModal";

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
  className={`${geistSans.variable} ${geistMono.variable} antialiased text-slate-900 bg-[#f7f4ee] relative overflow-hidden`}
>
  {/* Background glow */}
  <div className="pointer-events-none fixed inset-0 -z-10">
    {/* soft red glow — centered lower */}
    <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-red-200/30 blur-[160px]" />

    {/* subtle neutral depth */}
    <div className="absolute top-[55%] left-[25%] w-[600px] h-[600px] rounded-full bg-black/5 blur-[180px]" />
  </div>

  <Navbar />
  {children}
  <RecordingModal />
  <ToasterProvider />
</body>
    </html>
  );
}
