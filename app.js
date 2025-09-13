import cookieParser from 'cookie-parser';
import express from 'express';
import { hostname } from 'os';
import { PORT } from './config/env.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.route.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connnectToDatabase from './database/mongodb.js';

const app = express();

// NOTE: make sure that the JSON parsing and other middlewares are implemented before the routes start NOT after it 
// without express.json() req.body will always be undefined for JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use is primarily used by express to register global middlewares, include middleware between URl and Controller in form of a chain
// or in this case we are using it to mount a router on a sepcific route
// making express use the Routers 
app.use('/api/v1/auth', authRouter);
// NOTE: keeping the naming plural (subscription(s)) is always a good practise for redability in REST API.
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter);

// creating the first route for the home page of the application that the user will hit
app.get('/', (req, res) => {
    res.send({ body: 'Welcome to the Subscription Tracker!' })
})

// making the app listen to the port specified for incoming HTTP requests and handle them according to the routes defined
app.listen(PORT, hostname, async () => {
    console.log(`Server is running at http://${hostname}:${PORT}`);
    // as soon as we start the server we can also start connecting to the database
    await connnectToDatabase();
})


export default app;
