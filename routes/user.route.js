import { Router } from "express";

const userRouter = Router();

// Get all users -- ideally ADMIN only access
userRouter.get('/', (req, res) => res.send({ title: "Get All Users" }));

// Get user by a particular id
userRouter.get('/:id', (req, res) => res.send({ title: "Get the user of a particular Id" }));

// Create a new user
userRouter.post('/', (req, res) => res.send({ title: "CREATE a new user" }));

// Update an exiting user information via their id
userRouter.put('/:id', (req, res) => res.send({ title: "UPDATE a user" }));

// Delete an existing user information via their id
userRouter.delete('/:id', (req, res) => res.send({ title: "DELETE a user" }));

export default userRouter;