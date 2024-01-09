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
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();

    // create one order as User #1

    const userOne = signin();

    const orderOne = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticketOne.id })
        .set('Cookie', userOne)
        .expect(201);

    // Create two orders as User #2

    const userTwo = signin();
    const OrderTwo = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticketTwo.id })
        .set('Cookie', userTwo)
        .expect(201);

    const OrderThree = signin();
    const userTwoOrder = await request(app)
        .post('/api/orders')
        .send({ ticketId: ticketThree.id })
        .set('Cookie', userTwo)
        .expect(201);



    // Make request to get orders for User #2

    const res = await request(app).get('/api/orders').set('Cookie', userTwo).expect(200)

    // Make sure we only got the orders for User #2
    expect(res.body.length).toBe(2)
})
