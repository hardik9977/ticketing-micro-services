import { currentUser, requiresAuth } from "@haribooking/common";
import { Request, Router, Response } from "express";
import { Order } from "../models/Orders";

const router = Router();

router.get('/api/orders', requiresAuth, async (req: Request, res: Response) => {

    const orders = await Order.find({ userId: req.currentUser?.id }).populate('ticket');
    res.status(200).send(orders);

});

export { router as indexOrderRouter };