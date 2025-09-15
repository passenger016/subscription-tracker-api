import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// middleware to validate JWT token and or user type if needed in order to make sure that user is logged in for certain routes which are 'protected'

const authorize = async (req, res, next) => {
    try {
        let token;
        // we will check the header of the incoming http request for 'Bearer' token
        // in order to pass JWT tokens, the standard format is the request gets a Bearer token added to it in format
        //  Authorization: Bearer <jwt_token_here>
        // For any route that requires authentication, the client must include the token in the HTTP header
        // this is the step where the token is added in the HTTP request via the Auth header if using an HTTP tool

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // split the value at the point of <space> and take in the 1th index value of the returned array
            console.log(req.headers.authorization.split(' ')) // for debugging purpose -- comment out in production
            token = req.headers.authorization.split(' ')[1];
        }

        // if no token exists then return an unauthorized reponse
        if (!token) res.status(401).json({ message: "Unauthorized" });

        // if token exists then we will verify it using the original secret 
        const decoded = jwt.verify(token, JWT_SECRET);

        // the decoded value will be the userId since that was the value encoded using the JWT_SECRET intially while making the token
        const user = await User.findById(decoded.userId).select("-password");

        // if a user doesn't exist then it's an invalid JWT token
        // 401: UNAUTHORIZED
        if (!user) res.status(401).json({ message: "Unauthorized" });

        // if all checks out then we will pass on the request after loading the user data on the req as req.user
        // this data from the req could be later used to check if the user is valid or not by the other controllers and middlewares in the chain without having to verify the jwt
        req.user = user;
        // and then call next()
        next()
    }
    catch (err) {
        next(err);
    }
}

export default authorize;