import cookieParser from 'cookie-parser';
import express from 'express';
import { hostname } from 'os';
import { PORT } from './config/env.js';

const app = express();

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
