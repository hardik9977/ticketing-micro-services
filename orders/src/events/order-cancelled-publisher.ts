import { OrderCancelledEvent, Publisher, Subjects } from "@haribooking/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}