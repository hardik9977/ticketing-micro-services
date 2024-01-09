import { Listener, Subjects, TicketCreatedEvent } from "@haribooking/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../models/Ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketCreateListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    readonly queueGroupName = queueGroupName;
    onMessage = async (data: TicketCreatedEvent['data'], msg: Message) => {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price
        })
        await ticket.save();
        msg.ack();
    }
}