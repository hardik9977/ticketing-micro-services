import { Request, Response, NextFunction } from "express";
import { NotAuthorizedError } from "../error/not-authorize-error";

export const requiresAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }
    next();
};