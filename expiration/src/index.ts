import { OrderCreateListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const PORT = 3000;
const start = async () => {
    if (!process.env.NATS_URL || !process.env.NATS_CLUSTER_ID || !process.env.NATS_CLIENT_ID) {
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
        new OrderCreateListener(natsWrapper.client).listen();
    } catch (err) {
        console.log(err);
    }
};

start();

