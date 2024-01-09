import { Router, Response, Request } from "express";
import { requiresAuth, validationRequest, NotFoundError, NotAuthorizedError, BadRequestError } from '@haribooking/common';
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = Router();

router.put("/api/tickets/:id", requiresAuth, [
    body("title").trim().notEmpty().withMessage("Please enter title"),
    body("price").trim().isFloat({ gt: 0 }).withMessage("Please enter title")
], validationRequest, async (req: Request, res: Response) => {
    const postId = req.params.id;
    const ticket = await Ticket.findById(postId);
    if (!ticket) {
        throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
    }

    if (ticket.orderId) {
        throw new BadRequestError("Can not edit ticket at this time");
    }

    const { title, price } = req.body;
    ticket.set({
        title,
        price
    });
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    res.status(201).send({ ticket });
});

export { router as updateTicketRouter }