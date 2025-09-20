import aj from "../config/arcjet.js";

// NOTE: Make sure to app.use(arcjet.middleware.js) under '/app.js' in order to implement in on the app before placing it between the http request and the controller

const arcJetMiddleware = async (req, res, next) => {
    try {
        // we will take away { requested: 'mentioneNumberOfTokens' } token from the bucket for every request to implement the arcjet token bucket algorithm
        // check arcjet docs for more infomration on this
        const decision = await aj.protect(req, { requested: 2 });

        // if arcjet decides to deny the request then we will first firgure out the reasoning for the denial
        if (decision.isDenied()) {
            // if the reasoning for the denial is rate limit exceeded
            if (decision.reason.isRateLimit()) return res.status(429).json({ error: 'Rate limit exceeded' });
            // if the reasoning is for bot detection
            if (decision.reason.isBot()) return res.status(403).json({ error: 'Bot detected' });

            // for general denial`
            return res.status(403).json({ error: 'Access denied' });
        }
        next(); // if the decision is not denied then pass on to the next handler/controller in the chain
    }
    catch (err) {
        console.log(`Arcjet middleware error occurred: ${err}`);
        next(err);
    }
}

export default arcJetMiddleware