import express, {Request, Response} from 'express';
import {check, validationResult } from "express-validator";
import User from '../models/user';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import verifyToken from '../middleware/auth';

const router = express.Router();


router.post("/login", [
    check("email","Incorrect Email.").isEmail(),
    check("password","Password is required.").isLength({min:6})
    ],
    async (req: Request, res: Response) => {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({message: errors.array()[0].msg});
    }
    
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email})  // mongodb checks email

        if (!user){
            return res.status(400).json({message: "Invalid Credentials"}); //we dont want to clue what is wrong so give generic
        }
        
        const isMatch = await bcrypt.compare(password, user.password); // you cant change the parameter sequence in compare otherwise it wont work

        if (!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const token = jwt.sign(
            {userId: user.id},
            process.env.JWT_SECRET_KEY as string,
            {expiresIn: "1d",});
        
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        });

        res.status(200).json({userId: user._id})

    }
    catch(error){
        console.log(error);
        res.status(500).send({message: "Something went wrong."});
    }

});

// this route will be called everytime before any api call to validate the cookie
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
    res.status(200).send({userId: req.userId});
    
});

router.post("/logout",(req: Request, res: Response) => {
    res.cookie("auth_token", "", { 
        expires: new Date(0), //makes invalid the token
    });
    res.send();
});

export default router;