import request from "supertest"
import { app } from "../../app"
import { Ticket } from "../../models/Ticket"
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

it('fetch orders for an particular user', async () => {
    // create three Ticket

    const ticketOne = await createTicket();

    // create one order as User #1

    const userOne = signin();

    const orderOne = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticketOne.id })
        .set('Cookie', userOne)
        .expect(201);

    const res = await request(app).get(`/api/orders/${orderOne.body.id}`).set('Cookie', userOne).expect(200);

    expect(res.body).toBeTruthy()
})

it('return an error if user tries to fetch another users order', async () => {
    // create three Ticket

    const ticketOne = await createTicket();

    // create one order as User #1

    const userOne = signin();
    const userTwo = signin();

    const orderOne = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticketOne.id })
        .set('Cookie', userOne)
        .expect(201);

    await request(app).get(`/api/orders/${orderOne.body.id}`).set('Cookie', userTwo).expect(401);
})
