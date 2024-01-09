import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

import { newOrderRouter } from './routes/new';

import { errorHandler, NotFoundError, currentUser } from '@haribooking/common';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors());
app.use(morgan("dev"));

app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser)

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter)


app.use("*", async (req: Request, res: Response) => {
    throw new NotFoundError("Page Not Found");
});
app.use(errorHandler);

export { app }