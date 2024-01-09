import mongoose, { ConnectOptions } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from "../app";
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper.ts')

let mongoServer: any;
beforeAll(async () => {
    process.env.JWT_KEY = "Mahadev";
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    await mongoose.connect(uri, mongooseOpts as ConnectOptions);
})

beforeEach(async () => {
    await mongoose.connection.dropDatabase();
})


afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
})

declare global {
    var signin: () => string[];
}

global.signin = () => {
    const user = {
        email: "test@gmail.com",
        id: new mongoose.Types.ObjectId().toHexString()
    };
    const token = jwt.sign(user, process.env.JWT_KEY!);
    const session = {
        jwt: token
    }
    const cookies = Buffer.from(JSON.stringify(session)).toString("base64");
    return [`session=${cookies}`];
}