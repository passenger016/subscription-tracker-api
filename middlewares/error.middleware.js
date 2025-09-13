
const errorMiddleware = (err, req, res, next) => {
    try {
        // destructuring the error object to avoid mutating it
        let error = { ...err };
        // setting the message property of the error object to the message property of the original error object
        error.message = err.message;
        console.error(err);

        // now we will handle specific errors
        // Mongoose bad ObjectId error
        if (err.name === "CastError") {
            const message = `Resource not found with id of ${err.value}`; 
            error = new Error(message);
            error.statusCode = 404;
        }
        // Mongoose duplicate key error
        if (err.code === 11000) {
            const message = "Duplicate field value entered";
            error = new Error(message);
            error.statusCode = 400;
        }
        // Mongoose validation error
        if (err.name === "ValidationError") {
            const message = Object.values(err.errors).map(val => val.message).join(", ");
            error = new Error(message);
            error.statusCode = 400;
        }
        // if statusCode is not set then we will set it to 500 for generic server error
        res.status(error.statusCode || 500).json({
            success: false,
            error: error.message || "Server Error"
        })
    }
    catch (err) {
        next(err);
    }
}

export default errorMiddleware;