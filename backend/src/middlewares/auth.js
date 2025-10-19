import jwt from "jsonwebtoken";

export function auth(req,res,next){
    const header= req.headers.authorization || "";
    const token= header.startswith("Bearer") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorization" });

    try {
        const playload= jwt.verify(token, process.env.JWT_SECRET);
        req.user= playload;
        next(); 
    } catch {
        return res.status(401).json({message: "Invalid token"});
    }
}

