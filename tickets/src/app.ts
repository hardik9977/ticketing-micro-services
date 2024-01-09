import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieSession from 'cookie-session';

import { newTicketRouter } from './routes/new';

import { errorHandler, NotFoundError, currentUser } from '@haribooking/common';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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

app.use(newTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter)


app.use("*", async (req: Request, res: Response) => {
    throw new NotFoundError("Page Not Found");
});
app.use(errorHandler);

export { app }