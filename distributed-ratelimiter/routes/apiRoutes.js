import express from "express";
const router = express.Router()

router.get("/",(req,res)=>{
    console.log("API route is working");
    return res.status(200).json({message:"API route is working"})
})

export default router;