import {StreamChat} from "stream-chat"
import { ENV } from "./env.js"

const apiKey=ENV.STREAM_API_KEY
const apiSecret=ENV.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing")
}

export const chatClient=StreamChat.getInstance(apiKey,apiSecret)

export const upsertStreamUser=async(userData)=>{
    try {
        await chatClient.upsertUser(userData)
        console.log("Stream user upserted succcessfully",userData)
        return userData
    } catch (error) {
        console.error("Error upserting stream user:",error)
    }
}


export const deleteStreamUser=async(userId)=>{
    try {
        await chatClient.deleteUser(userId)
        console.log("SStream user deleted succesfully:",userId)
        return userData
    } catch (error) {
        console.error("Error deleting the stream user:",error)
    }
}

//todo another method to generatetoken