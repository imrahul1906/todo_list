import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
    jti: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    expiresAt: { type: Date, required: true },
    revoked: { type: Boolean, default: false }
});

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema); 