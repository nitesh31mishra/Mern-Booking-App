import express, {Request, Response} from 'express';
import User from '../models/user';
import jwt from "jsonwebtoken";
import {check, validationResult } from "express-validator";
import verifyToken from '../middleware/auth';

const router = express.Router();

// return current logged in user data
router.get("/me", verifyToken, async(req: Request, res: Response)=>{
    const userId = req.userId;

    try{
        const user= await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found"})
        }
        res.json(user);
    }catch(error){
        console.log(error);
        res.status(500).send({ message: "Something went wrong."});
    }
});


// /api/users/register
router.post("/register", 
    [
    check("firstName", "First Name is required").isString(), //check if passed and string
    check("lastName", "Last Name is required").isString(), //check if passed and string
    check("email", "Email is required").isEmail(), //check if passed and string
    check("password", "Password with 6 or more characters is required").isLength({min:6}), //check if passed and and min lenght 6
    ], 
    async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({message: errors.array()[0].msg});
    }
    
    try{
        let user = await User.findOne({
            email:req.body.email,
        });

        if (user) {
            return res.status(400).json({ message:"User already exists."});
        }

        user = new User(req.body)
        await user.save();

        const token = jwt.sign(
            {userId: user.id}, 
            process.env.JWT_SECRET_KEY as string,
            {expiresIn: "1d",} //after one day it will expire
            );

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", //if production secure will be TRUE else False
            maxAge: 86400000, //same as 1d but in millisecond
        })

        return res.status(200).send({ message: "User Registered Successfully!"});

    }catch(error){
        console.log(error);
        res.status(500).send({ message: "Something went wrong."});
    }
})

export default router;