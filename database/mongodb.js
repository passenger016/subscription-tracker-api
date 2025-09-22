import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

// check if DB_URI is defined or not
if (!DB_URI) {
    // throwing Error is used when we want to stop the execution of the current program and pass the error up the stack
    // the error is then handled by an error handler
    throw new Error('Please define mongo db URI environment variable inside .env.<production/development>.local file');
}
// if a proper DB_URI exists then we will setup a connection to the MongoDB database using mongoose
const connnectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to Database in ${NODE_ENV} mode`)
    }
    catch (error) {
        // when we want to log the error for debugging/observality but don't necessarily want to stop execution
        console.error("Error conneting to database:", error);

        process.exit(1);
    }
}

export default connnectToDatabase; // we will call it in app.js as soon as we start our application on app.listen