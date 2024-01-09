import { Router, Response, Request } from "express";
import { Subjects, requiresAuth, validationRequest } from '@haribooking/common';
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post("/api/tickets", requiresAuth, [
    body("title").trim().notEmpty().withMessage("Please enter title"),
    body("price").trim().isFloat({ gt: 0 }).withMessage("Please enter title")
], validationRequest, async (req: Request, res: Response) => {
    const { title, price, currentUser } = req.body;
    const ticket = Ticket.build({
        title,
        price,
        userId: req.currentUser?.id!
    })
    await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    });
    await ticket.save();
    res.status(201).send({ ticket });
});

export { router as newTicketRouter }