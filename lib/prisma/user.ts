import { prisma } from "../prisma"

export const getUserbyId = async(userId : string) => {
    try {
        const response = await prisma.user.findFirst({
            where : {
                id : userId
            }
        })
        return response;
    } catch (error) {
        console.log("error in fetching the user..",error)
        throw error
    }
}