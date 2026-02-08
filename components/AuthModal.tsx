"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useUiStore } from "@/store/useUiStore";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

export default function AuthModal() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("login");
  const [email,setEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")
  const [name,setName] = useState<string>("")
  const {activeModal,close,open} = useUiStore()
  const {signIn,signInSocial,signUp} = useAuthStore()

  const buttonhandler = async() => {
    if(mode=="login"){
        if(!email || !password){
            toast.error("Email or Password cannot be empty!!")
        }
        else{
            const user = await signIn({email,password})
            if(!user){
                toast.error("No user Exists!!")
            }
            else{
                router.push("/dashboard")
            }
        }
    }
    if(mode=="signup"){
        if(!email || !password || !name){
            toast.error("Fill all required fields!!")
        }
        else{
            const user = await signUp({email,password,name})
            if(user){
                router.push("/dashboard")
            }
        }
    }
    close()
  }

  const providerLogin = async(provider : 'google' | 'github') => {
    if(provider=='google'){
        const user = await signInSocial(provider)
        if(user) router.push('/dashboard')
    }
    if(provider=='github'){
        const user = await signInSocial(provider)
        if(user) router.push('/dashboard')
    }
    close()
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm w-full h-screen"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-[#fbf7ef] p-6 shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Welcome back</h2>
          <button
            onClick={close}
            className="rounded-full p-1 hover:bg-black/5 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* TABS */}
        <div className="mt-4 flex rounded-full bg-black/5 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition cursor-pointer ${
              mode === "login"
                ? "bg-white shadow"
                : "text-slate-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition cursor-pointer ${
              mode === "signup"
                ? "bg-white shadow"
                : "text-slate-500"
            }`}
          >
            Signup
          </button>
        </div>

        {/* BODY */}
        <div className="mt-6 space-y-4">
          {/* OAUTH */}
          <button onClick={() => providerLogin('google')} className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-black/90 cursor-pointer">
            Continue with Google
          </button>

          <button onClick={() => providerLogin('github')} className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 cursor-pointer">
            Continue with GitHub
          </button>

          {/* INFO BOX */}
          

          {/* FORM */}
          <div className="space-y-3">
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            )}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black"
            />

            {/* SUBMIT */}
            <button
            onClick={() => buttonhandler()}
            className="mt-2 w-full rounded-xl bg-gradient-to-r from-black to-red-600 py-3 text-sm font-semibold text-white shadow-lg transition cursor-pointer
                        hover:from-black hover:to-red-700
                        active:scale-[0.98]"
            >
            {mode === "login" ? "Sign in" : "Create account"}
            </button>

          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
            className="text-sm underline cursor-pointer"
          >
            {mode === "login"
              ? "Need an account?"
              : "Already have an account?"}
          </button>

          <button
            onClick={close}
            className="rounded-full border bg-white px-4 py-2 text-sm hover:bg-black/5 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
