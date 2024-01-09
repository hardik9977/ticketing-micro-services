import request from "supertest";

import { app } from "../../app";

import { Ticket } from "../../models/ticket";
// import { natsWrapper } from "../../__moke__/nats-wapper";

describe("New ticket", () => {
    it("has a route handler listening to /api/tickers for post requests", async () => {
        const res = await request(app).post("/api/tickets").send({});
        expect(res.statusCode).not.toEqual(404);
    });

    it("return 401 if user is not authorized", async () => {
        const res = await request(app).post("/api/tickets").send({});
        expect(res.statusCode).toEqual(401);
    });

    it("can only accessed if user is signed in", async () => {
        const cookies = signin();
        const res = await request(app).post("/api/tickets").set('Cookie', cookies).send({});
        expect(res.statusCode).not.toEqual(401);
    });

    it("return an error if an invalid title is provided", async () => {
        const cookies = signin();
        await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: " ", price: 10 }).expect(400);

        await request(app).post("/api/tickets").set('Cookie', cookies).send({ price: 10 }).expect(400);
    });

    it("return an error if an invalid price is provided", async () => {
        const cookies = signin();
        await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test", price: -10 }).expect(400);
        await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test" }).expect(400);
    });

    it("create a ticket with valid parameters", async () => {
        let ticket = await Ticket.find({});
        expect(ticket.length).toEqual(0);
        const cookies = signin();
        await request(app).post("/api/tickets").set('Cookie', cookies).send({ title: "Test", price: 10 }).expect(201);
        ticket = await Ticket.find({});
        expect(ticket.length).toEqual(1);
    });
})