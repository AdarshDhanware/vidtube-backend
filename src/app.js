import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config({
    path:"./env"
})

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}));

//accept json data
app.use(express.json({limit:"16kb"}));

// to take data from the url 
app.use(express.urlencoded({extended:true,limit:"16kb"}));

// temporary storage for the file storing on server 
app.use(express.static("public"))

app.use(cookieParser());


// routes
import userRouters from "./routes/user.routes.js"

app.use("/api/v1/users",userRouters);


// routes declaration

// https://localhost:8000/api/v1/users/register

export {app}