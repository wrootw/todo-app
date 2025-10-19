import { Router } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/User.js"


const r= Router();

r.post("/register", async (req,res) => {
    const { email,password }= req.body || {};
    if (!email || !password) return res.status(400).json({ message: "email & passwork require" });
    if (await User.findOne({ email })) return res.status(409).json({ message: "Email is Already Register" });
    const hash= await bcrypt.hash(password, 10);
    const user= await User.create({ email, password:hash });
    res.status(201).json({ id:user._id, email:user.email })
});

r.post("/login", async (req,res) => {
    const { email,password }= req.body || {};
    const user= await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password,user.password)))
        return res.status(401).json({message: "Invalid Credentials"});
    const token= jwt.sign({ id:user._id, email:user.email }, process.env.JWT_SECRET, { expiresIn: "7d" } );
    res.json({ token, user:{ id:user._id, email:user.email } });
})

export default r;