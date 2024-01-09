import { Listener, Subjects, OrderCreatedEvent } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreateListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: OrderCreatedEvent['data'], msg: Message) => {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        await expirationQueue.add({ orderId: data.id }, {
            delay,
            attempts: 2
        });
        msg.ack();
    }
}