import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticker-created-publisher';

const stan = nats.connect("ticketing", 'abc23', {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log("Publisher connected to NATS");
    let i = 0;
    setInterval(async () => {
        const data = {
            id: '123',
            title: "concert",
            price: i++
        };
        await new TicketCreatedPublisher(stan).publish(data)
    }, 5000)
});