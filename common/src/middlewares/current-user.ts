import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../error/bad-request-error";
import jwt from 'jsonwebtoken';

interface UserPayload {
    id: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.session?.jwt;
    if (!token) {
        return next();
    }
    try {
        const payLoad = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
        req.currentUser = payLoad;
    } catch (err) {
        throw new BadRequestError("...");
    }
    next();

};