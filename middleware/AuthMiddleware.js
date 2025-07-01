import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export const middleware = (request, response, next) => {
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
        request.user = decoded; // if info is verified , attach user info in here.
        console.log("User authenticated successfully");
        next(); // call the next function in the route

    } catch (err) {
        return response.status(401).json({ message: "Invalid or expired token! Please login again" });
    }

}
