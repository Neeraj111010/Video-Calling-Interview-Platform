import express from "express"
import dotenv from "dotenv"
import path from "path"
import { ENV } from "./lib/env.js"
import { connectDb } from "./lib/db.js"

dotenv.config()
const app=express()


const _dirname=path.resolve()

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"Success from api 1"})
})

app.get("/books",(req,res)=>{
    res.status(200).json({msg:"Books endpoint"})
})


//make our app ready for development
if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname,"../frontend/dist")))

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(_dirname,"../frontend","dist","index.html"))
    })
}
const startServer=async()=>{
    try {
        await connectDb()
        app.listen(ENV.PORT,()=>
    console.log("Server is running on port:",ENV.PORT))
    } catch (error) {
        console.error('Error starting the server',error)
    }
 }

 startServer()