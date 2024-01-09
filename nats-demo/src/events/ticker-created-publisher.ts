import { Publisher } from "./base-publisher";
import { Subjects } from "./subects";
import { TicketCreatedEvent } from "./ticket-created-events";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}