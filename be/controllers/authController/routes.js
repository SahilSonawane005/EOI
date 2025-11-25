import express from "express";
import controller from "./controller.js";

const authRouter = express.Router();

authRouter.post("/login", controller.login);

export default authRouter