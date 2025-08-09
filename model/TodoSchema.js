import mongoose from "mongoose";

const schema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

schema.index({ owner: 1 });

export const TODO = mongoose.model('TODO', schema)