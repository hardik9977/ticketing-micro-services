import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../model/Orders';
import { OrderStatus } from '@haribooking/common';

it('return 404 if order does not exits', async () => {
    await request(app).post('/api/payments').send({ orderId: new mongoose.Types.ObjectId().toHexString(), token: "xyz" }).set('Cookie', signin()).expect(404);
});

it('return 401 when purchasing an order that does not belong to that user', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString()
    const order = Order.build({
        id: orderId,
        userId: "xyz",
        status: OrderStatus.AwaitingPayment,
        price: 123,
        version: 1
    });
    await order.save();
    await request(app).post('/api/payments').send({ orderId: orderId, token: "xyz" }).set('Cookie', signin()).expect(401);
});

it("return a 400 when purchasing a cancelled order", async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId: userId,
        status: OrderStatus.Cancelled,
        price: 123,
        version: 1
    });
    await order.save();
    await request(app).post('/api/payments').send({ orderId: orderId, token: "xyz" }).set('Cookie', signin(userId)).expect(400);
});
