import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minLength: [5, "Name must be at least 5 characters"],
        maxLength: [50, "Name is too large"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters"],
        maxLength: [300, "Password is too large"],
    },
    // Schema definition ends here then we add a timestamp for when the user was created or updated
}, { timestamps: true });

// the above mentioned schema is just the structure we haven't created a model with it yet
// now we need to create a model from the schema
const User = mongoose.model("User", userSchema);
export default User;