import { Listener, Subjects, OrderCreatedEvent } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreateListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: OrderCreatedEvent['data'], msg: Message) => {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket Not Found');
        }

        ticket.set({ orderId: data.id })
        await ticket.save();

        const { id, title, price, userId, version, orderId } = ticket;

        await new TicketUpdatedPublisher(this.client).publish({
            id, title, price, userId, version, orderId
        })
        msg.ack();
    }
}