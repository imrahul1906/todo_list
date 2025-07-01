import mongoose from "mongoose";

const schema = new mongoose.Schema({
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

export const TODO = mongoose.model('TODO', schema)