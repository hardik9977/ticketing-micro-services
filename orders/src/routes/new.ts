import { BadRequestError, NotFoundError, OrderStatus, requiresAuth, validationRequest } from "@haribooking/common";
import { Request, Router, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/Ticket";
import { Order } from "../models/Orders";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/order-created-publisher";

const router = Router();

const EXPIRATION_WINDOWS_SECONDS = 60;

router.post('/api/orders', requiresAuth, [body("ticketId").trim().notEmpty().withMessage("TicketId must be provided")], validationRequest, async (req: Request, res: Response) => {
    // find the ticket which user is trying to order in the database

    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
        throw new NotFoundError();
    }

    // Make sure that ticket not already reserved
    // Run query to look at all order. find an order where the ticket is the ticket we just found
    // and the order status is not cancelled.
    // If we find an order from that means the ticket is reserved.
    const isReserved = await ticket.isReserved();

    if (isReserved) {
        throw new BadRequestError("Ticket is already reserved");
    }

    // calculate expires date for this order

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);

    // Build order and save it to the data base

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();

    // Publish Event

    await new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        status: order.status,
        ticket: {
            id: order.ticket.id,
            price: order.ticket.price,
        }
    });

    res.status(201).send(order);

});

export { router as newOrderRouter };