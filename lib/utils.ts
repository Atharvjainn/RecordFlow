import toast from "react-hot-toast";

export const copylink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Copied to clipboard!")
    } catch (error) {
        console.log(error);
        toast.error("Cannot Copy")        
    }
}