import Queue, { Job } from "bull";
import { ExpirationCompletedListener } from "../events/publish/expiration-completed-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQueue.process(async (job: Job) => {
    console.log(`Publish expiration complete for order ${job.data.orderId}`);
    new ExpirationCompletedListener(natsWrapper.client).publish({
        orderId: job.data.orderId
    })
});

export { expirationQueue }