import request from "supertest";

import { app } from "../../app";

import { Ticket } from "../../models/ticket";

describe("index ticket", () => {
    it("get all ticket", async () => {
        const cookies = signin();
        await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test", price: 10 }).expect(201);
        await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test", price: 10 }).expect(201);
        const res = await request(app).get("/api/tickets").send({}).expect(200);
        expect(res.body.tickets.length).toEqual(2);
    });
})