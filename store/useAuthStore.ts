import { signIn, signOut, signUp,signInSocial, getcurrentUser } from '@/lib/actions/auth-actions'
import { create } from 'zustand'
import type { User } from '@/lib/types'
import toast from 'react-hot-toast'



type AuthStore = {
    authUser : User | null,
    isCheckingAuth : boolean,
    checkauth : () => void,
    hasCheckedAuth: boolean;
    signUp : (data : {email : string,password : string ,name : string}) => Promise < User | undefined>,
    signIn : (data : {email : string,password : string}) => Promise < User | undefined>,
    signOut : () => void,
    signInSocial : (provider : "google" | 'github') => Promise < User | void | undefined>,
}


export const useAuthStore = create<AuthStore>((set,get) => ({
    isCheckingAuth : false,
    authUser : null,
    hasCheckedAuth: false,

    checkauth : async () => {
        if(get().hasCheckedAuth) return;
        set({isCheckingAuth : true})
        try {
            const user = await getcurrentUser()
            set({authUser : user})
            if(user) toast.success("Signed In")
        } catch (error) {
            console.log("Error in signup store...")
        } finally {
            set({
                isCheckingAuth : false,
                hasCheckedAuth : true
            })
        }
    },

    signUp : async (data) => {
        set({isCheckingAuth : true})
        try {
            const {email,password,name} = data
            const result = await signUp(email,password,name);
            set({authUser : result.user})
            toast.success("Account created successfully!")
            return result.user
        } catch (error) {
            console.log("Error in signup store...")
            set({authUser : null})
            toast.error("Error creating account.")
        } finally{
            set({isCheckingAuth : false});
        }
    },

    signIn : async (data) => {
        set({isCheckingAuth : true})
        try {
            const {email,password} = data
            const result = await signIn(email,password)
            set({authUser : result.user})
            toast.success("Signed In successfully!")
            return result.user
        } catch (error) {
            console.log("Error in signup store...")
            set({authUser : null})
            toast.error("Cannot Sigin...")
        } finally{
            set({isCheckingAuth : false});
        }
    },

    signOut : async () => {
        set({isCheckingAuth : true})
        try {
            await signOut();
            set({authUser : null})
            toast.success("Logged Out Successfully!!")
        } catch (error) {
            console.log("Error in signup store...")
            toast.error("Cannot Logout...")
        } finally{
            set({
                isCheckingAuth : false,
                hasCheckedAuth : true
            })
        }
    },

    signInSocial : async (provider) => {
        set({isCheckingAuth : true})
        try {
            await signInSocial(provider);
           
        } catch (error) {
            console.log("Error in signup store...")
            set({authUser : null})
        } finally {
            set({isCheckingAuth : false})
        }
    }

}))