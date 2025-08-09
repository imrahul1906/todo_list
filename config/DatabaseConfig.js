import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

let isDBConnected = false;
export async function connectDB() {
    if (isDBConnected) {
        console.log("Database connection is already there.")
        return;
    }

    await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
        // Connection pool settings for better performance
        maxPoolSize: 50,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
    }).then(() => {
        isDBConnected = true;
        console.log("DB connection is successfull");
    }).catch((error) => {
        console.log(`Error in connection with DB: ${error}`);
    })
}
