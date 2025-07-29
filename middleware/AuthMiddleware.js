import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
import { User } from "../model/UserSchema.js";

export const middleware = async (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return response.status(401).json({ message: "No Authentication token provided" })
    }


    const token = authHeader.split(" ")[1];

    try {
        // JWT is split into 3 parts: header, payload, signature.
        // 1. It regenerates the signature using:
        //  - The header + payload received from the token
        //  - Your secret key (same one used during login)
        // 2. Compares it with the token’s signature:
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Fetch user and validate tokenVersion for global revocation support
        const user = await User.findById(decoded.id);
        if (!user || user.tokenVersion !== decoded.tokenVersion) {
            return response.status(401).json({ message: "Token has been revoked. Please login again." });
        }

        // Attach minimal info for downstream handlers
        request.user = { id: user._id };
        next(); // proceed to controller
    } catch (err) {
        return response.status(401).json({ message: "Invalid or expired token! Please login again" });
    }

}
