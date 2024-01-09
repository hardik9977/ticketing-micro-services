import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreateListener } from './events/listeners/order-created-listener';

const PORT = 3000;
const start = async () => {
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

        new OrderCancelledListener(natsWrapper.client).listen();
        new OrderCreateListener(natsWrapper.client).listen();

        await mongoose.connect(process.env.MONGO_URI);
        console.log("db Connected successfully");
        app.listen(PORT, async () => {
            console.log(`payments services started on ${PORT} ...!!!`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();

