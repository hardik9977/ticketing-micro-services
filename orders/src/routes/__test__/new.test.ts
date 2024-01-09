import request from "supertest"
import { app } from "../../app"
import mongoose from "mongoose"
import { Order } from "../../models/Orders"
import { Ticket } from "../../models/Ticket"
import { OrderStatus } from "@haribooking/common"
import { natsWrapper } from "../../nats-wrapper";

it('return an error if the ticket does not exits', async () => {
    const ticketId = new mongoose.Types.ObjectId().toString();
    await request(app)
        .post('/api/orders')
        .send({ ticketId })
        .set('Cookie', signin())
        .expect(404);
})

it('return error if ticket is already reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        "title": "Test Ticket",
        "price": 123
    });
    await ticket.save();

    const EXPIRATION_WINDOWS_SECONDS = 15 * 60;
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS);
    const order = Order.build({
        userId: new mongoose.Types.ObjectId().toString(),
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket
    });

    await order.save();
    await request(app)
        .post('/api/orders')
        .send({ ticketId: ticket.id })
        .set('Cookie', signin())
        .expect(400);

})

it('reservers a ticket', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        "title": "Test Ticket",
        "price": 123
    });
    await ticket.save();

    const res = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticket.id })
        .set('Cookie', signin())
        .expect(201);

    const order = await Order.findById(res.body.id);
    expect(order).toBeTruthy()
})

it('emit Order Created Event', async () => {
    const ticket = Ticket.build({
        "id": new mongoose.Types.ObjectId().toHexString(),
        "title": "Test Ticket",
        "price": 123
    });
    await ticket.save();

    const res = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticket.id })
        .set('Cookie', signin())
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
})