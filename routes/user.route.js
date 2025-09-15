import { Router } from "express";
import { getUser, getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Get all users -- ideally ADMIN only access
userRouter.get('/', getUsers);

// Get user by a particular id
userRouter.get('/:id', authorize, getUser);

// Create a new user
userRouter.post('/', (req, res) => res.send({ title: "CREATE a new user" }));

// Update an exiting user information via their id
userRouter.put('/:id', (req, res) => res.send({ title: "UPDATE a user" }));

// Delete an existing user information via their id
userRouter.delete('/:id', (req, res) => res.send({ title: "DELETE a user" }));

export default userRouter;