import { Publisher, Subjects, TicketCreatedEvent } from "@haribooking/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}