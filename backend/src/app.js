import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.router.js";
import { auth } from "./middlewares/auth.js"
import taskRouter from "./routes/tasks.router.js"
import "dotenv/config"

const app= express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.get("/api/auth", auth, (req,res) => {
    res.json([{id:1, title:"Demo", ownel: req.user.email}])
});
app.use("/api/tasks",taskRouter);


export default app;

