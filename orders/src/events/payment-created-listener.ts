import { Listener, OrderStatus, PaymentsCreatedEvent, Subjects } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/Ticket";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../models/Orders";

export class PaymentCreateListener extends Listener<PaymentsCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: PaymentsCreatedEvent['data'], msg: Message) => {
        const { orderId } = data;
        // const tic
        const order = await Order.findById(orderId);
        if (!order) {
            throw new Error("Order ot found");
        }
        order.set({ 'status': OrderStatus.Complete })
        await order.save();
        msg.ack();
    }
}