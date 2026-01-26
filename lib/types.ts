export interface User {
    email : string,
    emailVerified : boolean,
    id : string,
    image? : string | null | undefined,
    name : string,
    createdAt : Date,
    updatedAt : Date
}

export type Visibility = 'public' | 'private' 

export interface Video {
    id : string,
    title : string,
    description : string,
    videoId : string,
    videoUrl : string,
    thumbnailUrl : string,
    visibility : Visibility,
    duration : number | null,
    createdAt? : Date,
    updatedAt? : Date,
    userId : string
}

export interface PublicUser {
  id: string
  name: string | null
  image: string | null
}

export interface VideoWithUser {
  id: string
  title: string
  description: string
  visibility: Visibility
  videoId : string,
  user: PublicUser
}
