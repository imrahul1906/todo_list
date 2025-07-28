import mongoose from "mongoose";

let isDBConnected = false;
export async function connectDB() {
    if (isDBConnected) {
        console.log("Database connection is already there.")
        return;
    }

    await mongoose.connect('mongodb://localhost:27017', {
        dbName: "todo_db",
        // Connection pool settings for better performance
        maxPoolSize: 10,
        minPoolSize: 2,
        maxIdleTimeMS: 30000,
    }).then(() => {
        isDBConnected = true;
        console.log("DB connection is successfull");
    }).catch((error) => {
        console.log(`Error in connection with DB: ${error}`);
    })
}
