import mongoose from "mongoose"

import { ENV } from "./env.js"

export const connectDb=async()=>{
    try {
<<<<<<< HEAD
=======
        if(!ENV.DB_URL){
            throw new Error("DB_URL is not defined in environment variables")
        }
>>>>>>> a5d735a15329aed5eb3e8f61f092b8e853f85957
       const conn= await mongoose.connect(ENV.DB_URL)
       console.log("Connected to MOngoDb:",conn.connection.host)
    } catch (error) {
        console.error("Error connecting to MongoDB",error)
        process.exit(1) //0 means success,1 means failure
    }
}