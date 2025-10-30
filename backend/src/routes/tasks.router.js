import { Router } from "express";
import Task from "../models/Task.js";
import { auth } from "../middlewares/auth.js";



const router= Router();
router.use(auth);

router.get('/', async (req,res) =>{
    const { page=1, limit=10, q="", completed }= req.query;
    const where= {owner:req.user.id}
    if(q) where.$text= {$search:q};
    if(completed==="true") where.completed=true;
    if(completed==="false") where.completed=false;

    const skip= (Number(page)-1) * Number(limit);
    const [items, total]= await Promise.all([
             Task.find(where).sort({createdAt:-1}).skip(skip).limit(Number(limit)),
             Task.countDocuments(where)
    ]);

    res.json({items,total,page:Number(page),limit:Number(limit), pages:Math.ceil(total / Number(limit))})
});

router.get('/:id', async (req,res) =>{
    const doc= await Task.findOne({owner:req.user.id, _id:req.params.id});
    if (!doc) return res.status(404).json({message: "Not Found"});
    res.json(doc);
});

router.post('/', async (req,res) =>{
    const { title, description="", dueDate=null }= req.body || {}
    if(!title) return res.status(400).json({message:"title require"});
    const doc= await Task.create({owner:req.user.id, title, description, dueDate});
    res.status(201).json(doc)
});

router.patch("/:id", async (req,res) =>{
    const {title, description, dueDate, completed}= req.body;
    const doc= await Task.findOneAndUpdate(
        {_id:req.params.id, owner:req.user.id},
        {$set: {title, description, dueDate, completed:completed}},
        {new:true, runValidators:true}
    );
    if (!doc) return res.status(404).json({message:"Not Found"});
    res.json(doc);
});

router.delete('/:id', async (req,res) =>{
    const r= await Task.deleteOne({owner:req.user.id, _id:req.params.id});
    if (!r.deletedCount) return res.status(404).json({message:"Not Found"});
    res.status(204).end();
});


export default router;