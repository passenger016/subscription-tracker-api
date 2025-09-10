import { Router } from "express";

const subscriptionRouter = Router();

//IMPORTANT NOTE: since express checks the routes in a top-down manner, the more specific routes(static) should be defined first before the more general ones(dynamic) to avoid route conflicts

// Get all the subscriptions -- ideally reserved only for ADMIN
// NOTE: whenever a 'res.send()' is encountered that means that the api call has a endpoint there where a final response is being sent 
subscriptionRouter.get('/', (req, res) => res.send({ title: "Get all the Subscriptions" }));

// Get all upcoming subscriptions
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: "Get all the upcoming subscriptions" }));

// Get all the subscriptions of a particular subscription id
subscriptionRouter.get('/:id', (req, res) => res.send({ title: "Get all the Subscriptions of a subscription ID" }));

// Create a new subscription for a user
subscriptionRouter.post('/', (req, res) => res.send({ title: "Create a new Subscription for a user" }));

// Update an existing subscription information via their id
subscriptionRouter.put('/:id', (req, res) => res.send({ title: "Update a Subscription" }));

// Delete an existing subscription information via their id
subscriptionRouter.delete('/:id', (req, res) => res.send({ title: "Delete a Subscription" }));

// Get all the subscriptions of a particular user id unlike the previous one which was for a particular subscription id
subscriptionRouter.get('/user/:id', (req, res) => res.send({ title: "Get all the Subscriptions of a user ID" }));

// Cancel a particular user subscriptions via their subscription id
subscriptionRouter.delete('/:id/cancel', (req, res) => res.send({ title: "Cancel a Subscription" }));





export default subscriptionRouter;