import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";

describe("Update ticket", () => {
    it("return a 404 if the provided id does not exist", async () => {
        var id = new mongoose.Types.ObjectId().toHexString();
        const cookies = signin();
        const res = await request(app).put(`/api/tickets/${id}`).set('Cookie', cookies).send({ title: "Test", price: 10 }).expect(404);
    });

    it("return a 401 if the user not authenticated", async () => {
        var id = new mongoose.Types.ObjectId().toHexString();
        const res = await request(app).put(`/api/tickets/${id}`).send({ title: "Test", price: 10 }).expect(401);
    });

    it("return a 401 if user does not own ticket", async () => {
        const cookies = signin();
        const ticket = await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test", price: 10 }).expect(201);
        await request(app).put(`/api/tickets/${ticket.body.ticket.id}`).set('Cookie', signin()).send({ title: "Test", price: 10 }).expect(401);
    });

    it("return a 400 if if the user provides an invalid title or price", async () => {
        const cookies = signin();
        const ticket = await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test", price: 10 }).expect(201);
        await request(app).put(`/api/tickets/${ticket.body.ticket.id}`).set('Cookie', cookies).send({ title: "Test", price: -10 }).expect(400);
        await request(app).put(`/api/tickets/${ticket.body.ticket.id}`).set('Cookie', cookies).send({ title: "", price: 10 }).expect(400);
    });

    it("update the ticket provided valid inputs", async () => {
        const cookies = signin();
        const ticket = await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test", price: 10 }).expect(201);
        const updatedTicket = await request(app).put(`/api/tickets/${ticket.body.ticket.id}`).set('Cookie', cookies).send({ title: "update", price: 20 }).expect(201);
        const res = await request(app).get(`/api/tickets/${ticket.body.ticket.id}`).expect(200);
        expect(res.body.ticket.price).toEqual(updatedTicket.body.ticket.price);
        expect(res.body.ticket.title).toEqual(updatedTicket.body.ticket.title);
    });
});