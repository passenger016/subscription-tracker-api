import { Client as WorkFlowClient } from '@upstash/workflow';
import { QSTASH_TOKEN, QSTASH_URL } from '../config/env.js';

// create a new instance of the Upstash WorkFlow client
// this client will be used to interact with the Upstash WorkFlow service
// we need to provide the baseUrl and token for authentication

export const WorkFlowClient = new WorkFlowClient({
    baseUrl: QSTASH_URL,
    token: QSTASH_TOKEN
})

// now we will create a new file for running all kinds of workflows under '/routes/workflow.routes.js'