import { Listener, NotFoundError, Subjects, OrderCancelledEvent, TicketUpdatedEvent } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: OrderCancelledEvent['data'], msg: Message) => {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket Not Found');
        }

        ticket.set({ "orderId": undefined })
        await ticket.save();

        const { id, title, price, userId, version, orderId } = ticket;

        await new TicketUpdatedPublisher(this.client).publish({
            id, title, price, userId, version, orderId
        })
        msg.ack();
    }
}