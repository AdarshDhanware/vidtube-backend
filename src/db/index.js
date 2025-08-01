import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from "dotenv"

dotenv.config();

const connectDB=async () => {
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Mongo DB connection instance ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongo DB connection failed !!!!",error);
        process.exit(1);
    }
}


export {connectDB}