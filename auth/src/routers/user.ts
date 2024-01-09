import { Router, Request, Response } from "express";
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcypt from 'bcrypt';

import { User } from "../models/user";
import { BadRequestError, validationRequest, currentUser } from "@haribooking/common";

const router = Router();

router.get("/currentuser", currentUser, (req, res) => {

    res.status(200).send({ currentUser: req.currentUser || null });
});

router.post("/signup",
    [
        body('email').isEmail().withMessage('Not a valid e-mail address'),
        body('password').trim().isLength({ min: 4, max: 10 }).withMessage("Please enter valid password")
    ],
    validationRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw new BadRequestError("Email already exists");
        }

        const newUser = User.build({ email, password });
        await newUser.save();

        // Generate JWT 
        const token = await jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_KEY!);

        // send cookies;
        req.session = {
            jwt: token
        };
        res.status(201).send(newUser);
    });

router.post("/signin",
    [
        body('email').isEmail().withMessage('Not a valid e-mail address'),
        body('password').trim().notEmpty().withMessage("Please provide valid password")
    ],
    validationRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw new BadRequestError("invalid credentials");
        }

        const isValidPass = await bcypt.compare(password, user.password);
        if (!isValidPass) {
            throw new BadRequestError("Password invalid");
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
        req.session = {
            jwt: token
        };

        res.status(200).send(user);
    });

router.post("/signout", (req, res) => {
    req.session = null;
    res.status(200).send({ message: "Signout Successful" });
});

export { router as userRouter };