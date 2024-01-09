import { Request, Router, Response } from "express";
import { Order } from "../models/Orders";
import { NotAuthorizedError, NotFoundError, requiresAuth } from "@haribooking/common";

const router = Router();

router.get('/api/orders/:orderId', requiresAuth, async (req: Request, res: Response) => {
    // you can validate orderId also.
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== req.currentUser?.id) {
        throw new NotAuthorizedError();
    }
    res.status(200).send(order);

});

export { router as showOrderRouter };