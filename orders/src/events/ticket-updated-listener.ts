import { Listener, NotFoundError, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/Ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: TicketUpdatedEvent['data'], msg: Message) => {
        const { id, title, price, version } = data;
        const ticket = await Ticket.findByEvent({
            id,
            version
        });
        if (!ticket) {
            throw new Error('Ticket Not Found');
        }

        ticket.set({ title, price })
        await ticket.save();
        msg.ack();
    }
}