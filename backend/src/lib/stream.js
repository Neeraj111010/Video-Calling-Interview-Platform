import {StreamChat} from "stream-chat"
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js"

const apiKey=ENV.STREAM_API_KEY
const apiSecret=ENV.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    console.error("STREAM_API_KEY or STREAM_API_SECRET is missing")
}

export const streamClient=new StreamClient(apiKey,apiSecret) //will be used for video calls
export const chatClient=StreamChat.getInstance(apiKey,apiSecret)// will be used for chat feature

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
        console.log("Stream user deleted succesfully:",userId)
        return userData
    } catch (error) {
        console.error("Error deleting the stream user:",error)
    }
}

