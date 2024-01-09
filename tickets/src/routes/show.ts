import { Router, Response, Request } from "express";
import { NotFoundError } from '@haribooking/common';
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const router = Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    const postId = req.params.id;
    const ticket = await Ticket.findById(postId);
    if (!ticket) {
        throw new NotFoundError();
    }
    res.status(200).send({ ticket });
});

export { router as showTicketRouter }