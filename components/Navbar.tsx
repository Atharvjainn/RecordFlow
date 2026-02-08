"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User, VideoIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { userProfileUrl } from "@/lib/utils";
import AuthModal from "./AuthModal";
import { useUiStore } from "@/store/useUiStore";

export default function Navbar() {
  const router = useRouter();
  const { authUser, signOut, checkauth } = useAuthStore();
  const { activeModal, open } = useUiStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const scrolltovideos = () => {
    const element = document.getElementById('videos')
    if(element){
      element.scrollIntoView({
        behavior : "smooth",
        block : "start"
      })
    }
  }

  useEffect(() => {
    if(!authUser) checkauth();
    
  }, [checkauth]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      {activeModal === "Auth" && <AuthModal />}

      <header className="fixed top-4 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between rounded-full bg-[#f5f2ec]/80 backdrop-blur-xl border border-black/10 px-6 py-3 shadow-lg">

            {/* LOGO */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <VideoIcon size={18} />
              </div>
              <span className="text-sm font-semibold tracking-tight">
                RECORDFLOW
              </span>
            </button>

            {/* CENTER LINKS */}
            <nav className="hidden md:flex items-center gap-10 text-xs font-semibold tracking-widest text-slate-500">
              <Link href="/dashboard" className="hover:text-black transition">
                DASHBOARD
              </Link>
              <Link href="/" className="hover:text-black transition">
                HOME
              </Link>
              <button  onClick={scrolltovideos} className="hover:text-black transition cursor-pointer">
                VIDEOS
              </button>
            </nav>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">

              {/* SIGN IN */}
              {!authUser && (
                <button
                  onClick={() => open("Auth")}
                  className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-black/90 transition cursor-pointer"
                >
                  SIGN IN
                </button>
              )}

              {/* USER MENU */}
              {authUser && (
                <div ref={menuRef} className="relative">
                  <button
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-full bg-white px-2 py-1.5 shadow-sm border border-black/10 hover:shadow transition cursor-pointer"
                  > 
                    {authUser.image ? (
                      <img
                        src={authUser.image as string}
                        alt=""
                        className="h-7 w-7 rounded-full"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                        {authUser.name?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white border border-black/10 shadow-xl overflow-hidden">
                      <div className="px-4 py-3 text-xs font-semibold text-slate-500">
                        ACCOUNT
                      </div>

                      <Link
                        href={`/users/${authUser.id}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-black/5"
                      >
                        <User size={16} />
                        Profile
                      </Link>

                      <button
                        onClick={() => {
                          signOut();
                          setMenuOpen(false);
                          router.push("/");
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-black/5 cursor-pointer"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
