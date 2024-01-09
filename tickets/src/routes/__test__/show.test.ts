import request from "supertest";
import mongoose from "mongoose";

import { app } from "../../app";


describe("Show ticket", () => {
    it("return 404 if the ticket is not found", async () => {
        var id = new mongoose.Types.ObjectId().toHexString();
        const res = await request(app).get(`/api/tickets/${id}`).send({});
        expect(res.statusCode).toEqual(404);
    });

    it("return the ticket if the ticket is found", async () => {
        const cookies = signin();
        const ticket = await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test", price: 10 }).expect(201);
        const res = await request(app).get(`/api/tickets/${ticket.body.ticket.id}`).expect(200);
        expect(res.body.ticket.id).toEqual(ticket.body.ticket.id);
    });
})