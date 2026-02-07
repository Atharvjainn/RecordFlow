"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, User,VideoIcon } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { userProfileUrl } from "@/lib/utils";
import AuthModal from "./AuthModal";
import { useUiStore } from "@/store/useUiStore";

const Navbar = () => {
  const router = useRouter();
  const { authUser, signOut, checkauth } = useAuthStore();
  const {activeModal,open} = useUiStore()
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkauth();
  }, [checkauth]);

  // Close dropdown on outside click
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f7f4ee]/80 backdrop-blur">

      {activeModal=="Auth" && <AuthModal />}

      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">

        {/* LEFT — LOGO */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
            <VideoIcon />
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-black">RecordFlow</p>
            <p className="text-xs text-slate-500">
              Record · Upload · Organize
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 transition"
          >
            Dashboard
          </Link>

          {/* SIGN IN */}
          {!authUser && (
            <button
              onClick={() => {
                open('Auth')
              }}
              className="rounded-full border bg-white px-5 py-2 text-sm font-medium shadow-sm hover:bg-slate-50"
            >
              Sign in
            </button>
          )}

          {/* USER MENU */}
          {authUser && (
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border bg-white px-2 py-2 shadow-sm hover:shadow transition"
              >
                {/* Avatar */}
                {authUser.image ? <img className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white" src={authUser.image as string} alt="" />
                : 
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-semibold text-white">
                  {authUser.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                
                }
                

                {/* Name + Email */}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {authUser.name}
                  </span>
                </div>

                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {/* DROPDOWN */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-lg overflow-hidden">
                  <div className="px-4 py-3 text-sm font-semibold text-slate-700">
                    Account
                  </div>

                  <Link
                    href={userProfileUrl(authUser)}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50"
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
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50"
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
    </header>
  );
};

export default Navbar;
