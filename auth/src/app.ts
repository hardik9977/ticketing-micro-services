import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

import { userRouter } from './routers/user';
import { errorHandler, NotFoundError } from '@haribooking/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors());
app.use(morgan("dev"));

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use('/api/users/', userRouter);

app.use("*", async (req: Request, res: Response) => {
    throw new NotFoundError("Page Not Found");
});

app.use(errorHandler);

export { app }