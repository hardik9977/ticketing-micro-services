import { Listener, Subjects, OrderCreatedEvent } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Order } from "../../model/Orders";

export class OrderCreateListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: OrderCreatedEvent['data'], msg: Message) => {
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            price: data.ticket.price,
            status: data.status,
            version: data.version
        })
        await order.save();
        msg.ack();
    }
}