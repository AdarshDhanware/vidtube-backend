import {connectDB} from "./db/index.js"
import { app } from "./app.js"
import dotenv from "dotenv"

dotenv.config({
    path:"./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`Server started at PORT ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log(`Server creation failed ,Mongo DB connection failed : ${err}`);
})