import { Listener, NotFoundError, Subjects, OrderCancelledEvent, TicketUpdatedEvent, OrderStatus } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/Orders";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: OrderCancelledEvent['data'], msg: Message) => {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });
        msg.ack();
        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();
        msg.ack();
    }
}