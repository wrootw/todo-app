import mongoose from "mongoose";
import "dotenv/config"
import app from "./app.js";


const PORT= process.env.PORT || 5000;
mongoose.connect(process.env.MONGODB_URL).then(() => {
    app.listen(PORT, () => console.log(`API:http://localhost:${PORT}`));
})
.catch((err) => {
    console.log("连接失败");
    process.exit(1);
})