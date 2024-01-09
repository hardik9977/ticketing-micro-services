import { OrderStatus } from "@haribooking/common";
import mongoose, { Schema, model } from "mongoose";
import { TicketDoc } from "./Ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrdersAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrdersAttrs): OrderDoc;
}

const orderSchema = new Schema({
    userId: {
        type: String,
        require: true
    },
    status: {
        type: String,
        require: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (ticket: OrderDoc) => new Order(ticket);

export const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

