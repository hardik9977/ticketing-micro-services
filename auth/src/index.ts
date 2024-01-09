import mongoose from 'mongoose';

import { app } from './app';

const PORT = 3000;
const start = async () => {
    console.log("Test");
    if (!process.env.JWT_KEY || !process.env.MONGO_URI) {
        throw new Error("JWT_KEY or MONGO_URI not found");
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("db Connected successfully");
        app.listen(PORT, async () => {
            console.log(`Auth services started on ${PORT} ...!!!`);
        });
    } catch (err) {
        console.log(err);
    }
};

start();

