import mongoose from "mongoose";


const taskSchema= mongoose.Schema(
    {
        owner: {type:mongoose.Schema.Types.ObjectId, ref:"User", index:true, require:true},
        title: {type:String, require:true, trim:true},
        description: {type:String, default:""},
        completed: {type:Boolean, default:false, index:true},
        dueDate: {type:Date, default:null}        
    },
    {timeStamp:true, versionKey:false}
);

taskSchema.index({title:"text"});

export default mongoose.model("Task", taskSchema);