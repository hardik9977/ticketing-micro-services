import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreateListener } from './events/ticket-created-listener';
import { TicketUpdatedListener } from './events/ticket-updated-listener';
import { ExpirationCompletedListener } from './events/expiration-completed-listener';
import { PaymentCreateListener } from './events/payment-created-listener';

const PORT = 3000;
const start = async () => {
    console.log("Staring...")
    if (!process.env.JWT_KEY || !process.env.MONGO_URI || !process.env.NATS_URL || !process.env.NATS_CLUSTER_ID || !process.env.NATS_CLIENT_ID) {
        throw new Error("JWT_KEY or MONGO_URI not found");
    }
    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log("NATS close");
            process.exit();
        })

        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        new TicketCreateListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompletedListener(natsWrapper.client).listen();
        new PaymentCreateListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        console.log("db Connected successfully");
        app.listen(PORT, async () => {
            console.log(`tickets services started on ${PORT} ...!!!`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();

