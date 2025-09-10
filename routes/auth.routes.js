import Router from 'express';

// create a router instance and assigning it to authRouter instead of app
// this was we can modularize our routes and use them in the main app instead of having to call the entire express app
// whatever URLs are defined in this router will be prefixed with /auth when we use it in the main app
// we will define where this router will be prefixed to the route in the app.js main file 
const authRouter = Router();

authRouter.post('/sign-in', (req, res) => res.send({ title:"Sign In Route"}));
authRouter.post('/sign-up', (req, res) => res.send({ title:"Sign Up Route"}));
authRouter.post('/sign-out', (req, res) => res.send({ title:"Sign Out Route"}));

export default authRouter;