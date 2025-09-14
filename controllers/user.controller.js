// this file contains route which fall under the (protected) category
// that is they need logged in users, often of certain types if required (ex: ADMIN) in order to access them
// the '/middlewares/auth.middleware.js' middleware file validates the requests for a valid JWT token before hitting this controller function wherever applicable.
// the functions here work on the routes mentioned under '/routes/user.route.js'

import User from "../models/user.model.js"


// function to get all the Users stored in the database
// TODO: this function call should be reserved for user types of 'ADMIN' only --- under auth.middleware.js
export const getUsers = async (req, res, next) => {
    try {
        // get all the users
        const users = await User.find();
        res.status(200).json({
            success: true,
            data: users
        })
    }
    catch (err) {
        next(err)
    }
}

// function to get a specific user
// only for the specific logged in user who is trying to access it and the 'ADMIN'
export const getUser = async (req, res, next) => {
    try {
        // the user.id has been mounted on to the req.params during the GET request in the URL
        /*  IMPORTANT: 
            '-password' tells Mongoose to exclude the password field from the result.
            Because even though the user document in MongoDB has a password field, you don’t want to expose it in the API response.
        */
        const user = await User.findById(req.params.id).select('-password');
        res.status(200).json({
            success: true,
            data: { user }
        })
    }
    catch (err) {
        next(err);
    }
}