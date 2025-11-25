import express from "express";
import controller from "./controller.js";


const projectRoute = express.Router();

projectRoute.post("/create", controller.createProjectValidation);
projectRoute.get("/get",controller.getProject);

export default projectRoute;

