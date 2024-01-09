import { ExpirationCompletedEvent, Publisher, Subjects } from "@haribooking/common";
export class ExpirationCompletedListener extends Publisher<ExpirationCompletedEvent> {
    readonly subject = Subjects.ExpirationCompleted;
}