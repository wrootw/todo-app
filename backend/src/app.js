import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import authRouter from "./routes/auth.router.js";
import { auth } from "./middlewares/auth.js"

const app= express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.get("/api/auth", auth, (req,res) => {
    res.json([{id:1, titile:"Demo", ownel: req.user.email}])
})

const Port= process.env.PORT || 5000;
mongoose.connect(MONGODB_UR).then(
    app.listen(Port, () => console.log(`API:http://localhost:${Port}`))
)