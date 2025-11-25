import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import pool from "./config/config.js";
import projectRoutes from "./controllers/projectController/routes.js";
import eoiRoutes from "./controllers/eoiController/routes.js";
import authRouter from "./controllers/authController/routes.js"


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
  }),
);

app.use("/project-validation", projectRoutes);

app.use("/eoi", eoiRoutes);


app.use("/auth", authRouter);


app.get("/", (req, res) => {
  res.send("backend working");
});


// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
