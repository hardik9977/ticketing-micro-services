import mongoose, { ConnectOptions } from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { app } from "../app";


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
    var signin: () => Promise<string[]>;
}

global.signin = async () => {
    const user = {
        email: "hardik@gmail.com",
        password: "Hari@123"
    };
    const res = await request(app).post('/api/users/signup').send(user);
    expect(res.statusCode).toBe(201);
    const cookies = res.get('Set-Cookie');
    console.log(cookies)
    return cookies;
}