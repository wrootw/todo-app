import { strict } from "assert";
import mongoose from "mongoose";

const userSchema= new mongoose.Schema(
    {
        email: { type:String, unique:true, required:true, trim:true, lowercase:true },
        passwork: { type:String, required:true },
        createAt: { type:Date,  defalut: Date.now}
    },
    { versionkey: false }
)

export default mongoose.model("User", userSchema);