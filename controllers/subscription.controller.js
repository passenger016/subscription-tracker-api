import Subscription from "../models/subscription.model.js";
// NOTE: remember that WorkFlowClient is basically an instance of the Upstach 'Client'
import { WorkFlowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

// for creating subscriptions
export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body, // spreading the req body to get all the fields for the subscription
            user: req.user._id // attaching the user id from the authenticated user to the subscription -- IMPORTANT: this is taken from the JWT token (req.user is set in the auth middleware) not from the req.params or req.body (which could be manipulated by the client)
        })
        // NOTE: before sending the response we will trigger the workflow to send reminders for this subscription
        // importing a workflow client
        await WorkFlowClient.trigger(
            {
                // the url for development server will be different from the production server
                url:`${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                body:{
                    subscriptionId: subscription._id
                },
                headers:{
                    'content-type':'application/json'
                },
                retries: 0,
            }
        )

        // if the request is successful we will return the subscription object with a 201 status code
        return res.status(201).json({ success: true, data: subscription })
    }
    catch (err) {
        next(err);
    }
}
// for getting all subscriptions a user has created (this is not for the subscriptionId rather for the userId)
export const getAllSubscriptionsOfAUser = async (req, res, next) => {
    try{
        if(req.user.id!==req.params.id){
            const error = new Error("You are not authorized to view these subscriptions");
            // the client is authenticated but does not have the necessary permissions to access the resource
            error.status = 403;
            throw error;
        }
        // otherwise we will fetch all the subscriptions for the user
        const allSubscriptions = await Subscription.find({ user: req.params.id });
        return res.status(200).json({ success: true, data: allSubscriptions });
    }
    catch(err){
        next(err);
    }
}