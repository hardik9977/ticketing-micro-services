import { OrderStatus } from "@haribooking/common";
import mongoose, { Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrdersAttrs {
    id: string
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
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
    price: {
        type: Number,
        require: true
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

orderSchema.statics.build = (order: OrderDoc) => new Order({
    _id: order.id,
    version: order.version,
    status: order.status,
    userId: order.userId,
    price: order.price

});

export const Order = model<OrderDoc, OrderModel>('Order', orderSchema);

