import { Model, Schema, model, Document } from "mongoose";
import bcrypt from 'bcrypt';

interface User {
    email: string;
    password: string
}

interface UserDoc extends Document {
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});


userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashPassword = await bcrypt.hash(this.get('password'), 10);
        this.set('password', hashPassword);
    }
    done();
});

interface UserModel extends Model<UserDoc> {
    build(user: User): UserDoc;
}

userSchema.statics.build = (user: User) => new User(user);

export const User = model<UserDoc, UserModel>('User', userSchema);

