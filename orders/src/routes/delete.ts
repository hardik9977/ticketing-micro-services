import { NotAuthorizedError, NotFoundError, OrderStatus, requiresAuth } from "@haribooking/common";
import { Request, Router, Response } from "express";
import { Order } from "../models/Orders";
import { OrderCancelledPublisher } from "../events/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete('/api/orders/:orderId', requiresAuth, async (req: Request, res: Response) => {
    // you can validate orderId also.
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();
    // Publishing Event

    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: { id: order.ticket.id }
    })
    res.status(204).send(order);

});

export { router as deleteOrderRouter };