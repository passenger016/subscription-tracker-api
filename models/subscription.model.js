import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    // Name of the subscription plan
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: [3, "Subscription name must be at least 3 characters"],
    },
    // Cost of the subscription
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Subscription price must be at least 0"],
    },
    // Currency of the subscription price
    // NOTE: enum is a validator that restricts the input value to be one of the specified values
    currency: {
        type: String,
        required: [true, "Subscription currency is required"],
        enum: ["USD", "EUR", "GBP", "INR", "JPY", "CNY"],
    },
    // Billing cycle of the subscription
    frequency: {
        type: String,
        required: [true, "Subscription frequency is required"],
        enum: ["Daily", "Weekly", "Monthly", "Yearly"],
    },
    // Category of the subscription
    category: {
        type: String,
        required: [true, "Subscription category is required"],
        enum: ["Entertainment", "Productivity", "Education", "Health", "Other"],
    },
    // Payment method for the subscription
    paymentMethod: {
        type: String,
        required: [true, "Subscription payment method is required"],
        enum: ["Credit Card", "Debit Card", "PayPal", "Other"],
    },
    // Status of the subscription
    status: {
        type: String,
        required: [true, "Subscription status is required"],
        enum: ["Active", "Expired", "Cancelled"],
        default: "Active",
    },
    // Start date of the subscription
    startDate: {
        type: Date,
        required: [true, "Subscription start date is required"],
        validate: {
            // in mongoose 'validator' is a function that is called everytime a document is validated before saving
            validator: (value) => {
                return value <= new Date(); // checking if the start date is in the future otherwise we will return it
            },
            message: "Start date cannot be in the future",
        }
    },
    // Renewal date of the subscription
    renewalDate: {
        type: Date,
        // required: [true, "Subscription renewal date is required"],
        // NOTE: there is no need for a mandatory renewal date because if it is missing then we will autocalculate it based on startDate and frequency
        // we will validate if the renewal date is after the start date
        validate: {
            // IMPORTANT: using a normal function instead of an arrow function because we need to access 'this' keyword which refers to the current document being validated
            validator: function (value) {
                // this.startDate will give us the start date of the current document
                // without 'this' JS will search for startDate in the local scope of the validator function, it wouldn't find any and then throw an error
                return value >= this.startDate;
            },
            message: "Renewal date must be after start date",
        }
    },
    // Link it with the user who owns this subscription via the User schema
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // referencing the User model
        required: [true, "Subscription must belong to a user"], // every subscription must be associated with a user
        index: true, // creating an index on the user field for faster queries
    }
}, { timestamps: true });

// Now we will autocalculate the renewal date if it is missing
subscriptionSchema.pre('save', function (next) {
    // making a lookup table in form of key value pairs to calculate the renewal date
    const renewalPeriods = {
        daily: 1,
        weekly: 7,
        monthly: 30,
        yearly: 365,
    }
    // only run if renewal date doesn't exist for the current document
    if (!this.renewalDate) {
        // now we set the renewalDate for the current document
        // since a renewalDate doesn't exist hence we are first setting it to the current date only and then we will calculate it from there
        this.renewalDate = new Date(this.startDate);
        const period = renewalPeriods[this.frequency.toLowerCase()]; // normalizing the frequency to lowercase to match the keys in the lookup table and to ensure case insensitivity
        if (!period) {
            return next(new Error(`Invalid frequency: ${this.frequency}`));
        }
        // we then get the renewalDate and add the frequency to it based on the 'key' mentioned under 'frequency'
        // EXAMPLE: if current date is 2025-06-12 and frequency is montly then we will add 30 days (monthly:30) to that date
        this.renewalDate.setDate(this.renewalDate.getDate() + period);
    }

    // if renewalDate has passed the current date as of the upload of the subscription then we will autoupdate the status
    if (this.renewalDate < new Date()) {
        this.status = "Expired";
    }
    // after this entire process is done we will call next to move to the next middleware in the chain
    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;