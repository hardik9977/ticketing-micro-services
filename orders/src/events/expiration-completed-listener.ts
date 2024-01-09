import { ExpirationCompletedEvent, Listener, Subjects, OrderStatus } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../models/Orders";
import { OrderCancelledPublisher } from "./order-cancelled-publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    readonly subject = Subjects.ExpirationCompleted;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: ExpirationCompletedEvent['data'], msg: Message) => {
        const { orderId } = data;
        const order = await Order.findById(orderId).populate('ticket');
        if (!order) {
            throw new Error('Order Not Found');
        }

        if (order.status == OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({ status: OrderStatus.Cancelled })
        await order.save();
        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })
        msg.ack();
    }
}