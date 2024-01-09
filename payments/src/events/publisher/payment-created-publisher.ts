import { Publisher, Subjects, PaymentsCreatedEvent } from "@haribooking/common";

export class PaymentCreatedPublisher extends Publisher<PaymentsCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}