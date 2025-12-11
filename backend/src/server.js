import express from "express"
import dotenv from "dotenv"
import path from "path"
import { ENV } from "./lib/env.js"
import { connectDB } from "./lib/db.js"
import cors from "cors"
import {serve} from "inngest/express"
import { inngest,functions} from "./lib/inngest.js"
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"
import { protectRoute } from "./middlewares/protectRoute.js"

dotenv.config()
const app=express()

console.log("DB_URL:", process.env.DB_URL);

const _dirname=path.resolve()

//middleware
app.use(express.json())
//credentials true meaning ??=>server allows a browser to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use("/api/inngest",serve({client:inngest,functions}))
app.use("/api/chat",chatRoutes)
app.use("/api/sessions",sessionRoutes)

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"Success from api 1"})
})

app.get("/books",(req,res)=>{
    res.status(200).json({msg:"Books endpoint"})
})

app.get("/video-calls",protectRoute,(req,res)=>{
    res.status(200).json({msg:"this is a protected route"})
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
        await connectDB()
        app.listen(ENV.PORT,()=>
    console.log("Server is running on port:",ENV.PORT))
    } catch (error) {
        console.error('Error starting the server',error)
    }
 }

 startServer()
