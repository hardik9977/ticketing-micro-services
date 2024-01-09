import { Model, Schema, model, Document } from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface Ticket {
    title: string;
    price: number;
    userId: string;
}

interface TicketDoc extends Document {
    title: string;
    price: number;
    userId: string
    createdAt: string;
    updatedAt: string;
    version: number;
    orderId?: string
}

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

interface TicketModel extends Model<TicketDoc> {
    build(ticket: Ticket): TicketDoc;
}

ticketSchema.statics.build = (ticket: Ticket) => new Ticket(ticket);

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

