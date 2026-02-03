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


export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, ""); // 🔥 remove leading/trailing -
}




export function userProfileUrl(user: { id: string; name: string }) {
  return `/users/${slugify(user.name)}-${user.id}`
}