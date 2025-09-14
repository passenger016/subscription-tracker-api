import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// function for handling signUp requests
export const signUp = async (req, res, next) => {
    // first we will start a mongoose session where all the operations on the db will take place
    // the mongoose sessions ensures that we can perform Transcations in it 
    // in a Transaction all the db operations are atomic (either completed or not not partial)
    const session = await mongoose.startSession();
    /* 
        startTransaction() is called on a session object to begin a transaction. Once started, all operations using that session are part of the transaction. 
        You must then commit or abort the transaction. 
    */
    /*
        mongoose.startSession(): Creates a session for transaction support.
        session.startTransaction(): Begins a transaction within that session.
        All operations using that session are now atomic until you call session.commitTransaction() or session.abortTransaction().
    */
    session.startTransaction();
    try {
        // destructuring the email, name and password from the req body
        const { name, email, password } = req.body;
        // now we will query the database of the User document to look for an existing user
        const existingUser = await User.findOne({ email });
        // check if an user already exists if it does then throw error 
        if (existingUser) {
            const error = new Error("User already exists!")
            error.statusCode = 409;
            throw error;
        }
        // if a user doesn't exist however then create a new user

        // first we will hash the password using salt rounding
        const hashedPassword = await bcrypt.hash(password, 10);
        // now using that hashedPassword create the user
        const newUsers = await User.create([{
            name: name,
            password: hashedPassword,
            email: email,
        }])
        // for testing purpose we will log the value to terminal
        console.log(newUsers)

        // generate a jwt token and return it back to client for future use
        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // now this transaction is finished so we will commit it
        await session.commitTransaction();
        // if an error occurs then we will catch that in the cath(err) and then abort the transaction
        session.endSession();

        // 201: the request has been fulfilled and has resulted in the creation of one or more new resources. 
        // It is commonly used in response to POST requests where a new entity is created on the serve
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0]
            }
        })
    }
    catch (err) {
        // first abort the transaction
        await session.abortTransaction();
        // then end the session
        session.endSession();
        next(err)
    }

}

// function for handling signIn requests
export const signIn = async (req, res, next) => {

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // destructuring the email and password from the req.body
        const { email, password } = req.body;
        // we will check for an existing user in the User model by using the email as a query parameter
        // IMPORTANT: indOne expects a filter 'object', not a raw string.
        // passing just 'email' will result in errors we need to pass in {email}
        const existingUser = await User.findOne({ email });

        // if user doesn't exist then just throw an error, do not specify it as 404 in order to avoid giving hackers understanding of the db data
        // hence we return a generic "Invalid Credentials" with 403 of unauthorized
        if (!existingUser) {
            const error = new Error("Invalid Credentials")
            error.statusCode = 401;
            // 401: UNAUTHORIZED, a request to a server was denied because the client did not provide valid authentication credentials
            // CODE FOR DEBUGGING -- uncomment if needed during development
            // const error = new Error("User not found")
            // error.statusCode = 404;
            throw error;
        }
        // if the user exists then we will check if the password is valid or not
        // we will compare the password being entered with the exitingUser's 'password' field and match if them
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid Credentials")
            // 401: UNAUTHORIZED, a request to a server was denied because the client did not provide valid authentication credentials
            error.statusCode = 401;
            throw error;
        }
        // if everything is alright then we will allow the user to sigIn using the jwt token
        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // 200: OK
        res.status(200).json({
            success: true,
            message: "User signin successfully!",
            data: { token, existingUser }
        })


        session.commitTransaction();
        session.endSession();
    }
    catch (err) {
        session.abortTransaction();
        session.endSession();
        next(err);
    }
}

// function for handling signOut requests
export const signOut = (req, res, next) => {
     try {
        // In JWT-based systems, sign-out is handled on the client side
        // Optionally, you could implement server-side blacklisting here

        // For now, just return a success response
        // 200: OK
        res.status(200).json({
            success: true,
            message: "User signed out successfully. Please remove token from client storage."
        });
    } catch (err) {
        next(err);
    }
}