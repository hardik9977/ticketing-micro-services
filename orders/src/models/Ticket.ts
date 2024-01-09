import { Model, Schema, model, Document } from "mongoose";
import { Order } from "./Orders";
import { OrderStatus } from "@haribooking/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface Ticket {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
    version: number;
}

const ticketSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
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
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

ticketSchema.statics.build = (ticket: Ticket) => new Ticket({
    _id: ticket.id,
    title: ticket.title,
    price: ticket.price
});

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    })
}
ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this, status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.Complete,
                OrderStatus.AwaitingPayment
            ]
        }
    });
    return !!existingOrder
}

export const Ticket = model<TicketDoc, TicketModel>('Ticket', ticketSchema);

