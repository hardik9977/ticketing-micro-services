import { BadRequestError, NotAuthorizedError, NotFoundError, OrderStatus, requiresAuth, validationRequest } from "@haribooking/common";
import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../model/Orders";
import { stripe } from "../stripe";
import { PaymentCreatedPublisher } from "../events/publisher/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.post('/api/payments', requiresAuth, [
    body('token').notEmpty(),
    body('orderId').notEmpty().withMessage('Token not found')
], validationRequest, async (req: Request, res: Response) => {

    const order = await Order.findById(req.body.orderId);

    if (!order) {
        throw new NotFoundError('Order not found');
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Can not pay for cancelled order');
    }

    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: "ABC", // Payment Id that is not impletemted,
        orderId: order.id
    })

    res.status(200).send({ success: true })
})

export { router as createChargeRouter }