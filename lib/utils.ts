export const copylink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href)
    } catch (error) {
        console.log(error);        
    }
}