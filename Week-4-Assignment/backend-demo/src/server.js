import express from "express"
import { config } from "dotenv"
import taskRouter from "./routers/tasksRouter.js";
import connectDB from "./config/db.js";
import authRouter from "./routers/authenticationRouter.js";
import cors from "cors"
config();

const app=express();

connectDB();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);
// Middleware
app.use(express.json());

app.use("/api/auth/v1", authRouter);
//tasks
app.use("/api/tasks/v1", taskRouter);

const PORT=process.env.PORT || 4000;
app.listen(PORT,()=>console.log(`Server is running on PORT:${PORT}`))