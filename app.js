import cookieParser from 'cookie-parser';
import express from 'express';
import { hostname } from 'os';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.route.js';
import subscriptionRouter from './routes/subscription.routes.js';

const app = express();

// app.use is primarily used by express to register global middlewares, include middleware between URl and Controller in form of a chain
// or in this case we are using it to mount a router on a sepcific route
// making express use the Routers 
app.use('/api/v1/auth', authRouter);
// NOTE: keeping the naming plural (subscription(s)) is always a good practise for redability in REST API.
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// creating the first route for the home page of the application that the user will hit
app.get('/', (req, res) => {
    res.send({ body: 'Welcome to the Subscription Tracker!' })
})

// making the app listen to the port specified for incoming HTTP requests and handle them according to the routes defined
app.listen(PORT, hostname, async () => {
    console.log(`Server is running at http://${hostname}:${PORT}`)
})

export default app;
