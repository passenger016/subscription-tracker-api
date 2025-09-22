import { Router } from "express";

const WorkFlowRouter = Router();

// A test route to check if the workflow routes are working
WorkFlowRouter.get('/', (req, res) => res.send({ title: "Workflow routes are working" }));

export default WorkFlowRouter;
// now add this router to the main app in app.js
// we will also create a controller for handling all the workflow related logic in /controllers/workflow.controller.js