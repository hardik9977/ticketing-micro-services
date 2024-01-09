import { Publisher, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from "@haribooking/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}