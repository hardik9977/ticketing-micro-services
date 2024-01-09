import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-events";
import { Subjects } from "./subects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = 'payment-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event Data!', data)
        msg.ack();
    }

}