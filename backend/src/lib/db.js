import mongoose from "mongoose"

import { ENV } from "./env.js"

export const connectDb=async()=>{
    try {
       const conn= await mongoose.connect(ENV.DB_URL)
       console.log("Connected to MOngoDb:",conn.connection.host)
    } catch (error) {
        console.error("Error connecting to MongoDB",error)
        process.exit(1) //0 means success,1 means failure
    }
}