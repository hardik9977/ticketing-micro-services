import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';
import { TicketUpdatedListener } from './events/ticket-updated-listener';
console.clear();
const stan = nats.connect("ticketing", randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    new TicketCreatedListener(stan).listen();
    new TicketUpdatedListener(stan).listen();
    stan.on('close', () => {
        console.log("NATS close");
        process.exit();
    });

    stan
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());

