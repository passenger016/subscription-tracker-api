import { Router } from "express";
import { sendReminder } from "../controllers/workflow.controller.js";

const WorkFlowRouter = Router();

// A test route to check if the workflow routes are working
// updating it with the sendReminder controller function
WorkFlowRouter.post('/subscriptions/reminder', sendReminder);

export default WorkFlowRouter;
// now add this router to the main app in app.js
// we will also create a controller for handling all the workflow related logic in /controllers/workflow.controller.js