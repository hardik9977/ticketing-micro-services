import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/Ticket"
import { OrderStatus } from "@haribooking/common"
import { Order } from "../../models/Orders"
import { natsWrapper } from "../../nats-wrapper"
import mongoose from "mongoose"

const createTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Test',
        price: 123
    })
    await ticket.save();

    return ticket;
}

it('Cancel orders for an particular user', async () => {
    // create three Ticket

    const ticketOne = await createTicket();

    // create one order as User #1

    const userOne = signin();

    const orderOne = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticketOne.id })
        .set('Cookie', userOne)
        .expect(201);

    const res = await request(app).delete(`/api/orders/${orderOne.body.id}`).set('Cookie', userOne).expect(204);
    console.log(res.body)
    const order = await Order.findById(orderOne.body.id);
    expect(order?.status).toBe(OrderStatus.Cancelled)
})

it('Emit Cancel Order Event', async () => {

    const ticketOne = await createTicket();

    // create one order as User #1

    const userOne = signin();

    const orderOne = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticketOne.id })
        .set('Cookie', userOne)
        .expect(201);

    const res = await request(app).delete(`/api/orders/${orderOne.body.id}`).set('Cookie', userOne).expect(204);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
