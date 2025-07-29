import { TODO } from "./TodoSchema.js";
import { User } from "./UserSchema.js";
import { RefreshToken } from "./RefreshTokenSchema.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

export class TodoModel {

    async loginUser(request) {
        const email = request.body.email;

        // Check if user exists
        const user = await this.userExist(email);
        if (user == null) {
            throw new Error("No such user exists");
        }

        // check if passwords match
        // 1. this will remove the salt from hashed password
        // 2. apply that salt to the input password and hash that
        // 3. compare both password.
        const isMatch = await bcrypt.compare(request.body.password, user.password);
        if (!isMatch) {
            throw new Error("Entered password is wrong");
        }

        // Generate token
        const token = await this.createToken(user);
        const refreshToken = await this.createRefreshToken(user);
        return { token, refreshToken };
    }

    async registerUser(request) {
        const user = await this.userExist(request.body.email);
        if (user) {
            throw new Error("User already exists with this email");
        }

        const password = await this.encryptPassword(request.body.password);

        const newUser = await User.create({
            name: request.body.name,
            email: request.body.email,
            password
        });

        const token = await this.createToken(newUser);
        const refreshToken = await this.createRefreshToken(newUser);
        console.log("User is registered successfully");

        const data = {
            user: newUser,
            tokens: {
                token,
                refreshToken
            }
        }
        return data;
    }

    async createToken(user) {
        const payload = {
            id: user._id,
            tokenVersion: user.tokenVersion
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: '15m'
        })
        return token;
    }

    async createRefreshToken(user) {
        const jti = crypto.randomUUID();

        const payload = {
            id: user._id,
            tokenVersion: user.tokenVersion,
            jti
        }

        const token = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
            expiresIn: '7d'
        })

        // Persist single-use refresh token meta-data
        await RefreshToken.create({
            jti,
            userId: user._id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revoked: false
        });

        return token;
    }

    // hash password as storing password directly is not secure enough.
    // 1. install bcryptjs.
    // 2. create salt : random string so that no same password has same hash
    // 3. hash password
    async encryptPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(password, salt);
        return hashedPwd;
    }

    async refreshToken(request) {
        const incomingToken = request.body.token;
        if (!incomingToken) {
            throw new Error("Refresh token not found");
        }

        let decoded;
        try {
            decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_KEY);
        } catch (err) {
            throw new Error("Invalid or expired refresh token");
        }

        // Validate against DB (single-use)
        const stored = await RefreshToken.findOne({
            jti: decoded.jti,
            userId: decoded.id,
            revoked: false
        });

        if (!stored) {
            throw new Error("Refresh token revoked or not found");
        }

        // Revoke old token
        stored.revoked = true;
        await stored.save();

        // Generate new pair
        const user = await User.findById(decoded.id);
        const newAccessToken = await this.createToken(user);
        const newRefreshToken = await this.createRefreshToken(user);

        return { token: newAccessToken, refreshToken: newRefreshToken };
    }

    async logout(request) {
        const incomingToken = request.body.token;
        if (!incomingToken) {
            throw new Error("Refresh token not provided for logout");
        }

        let decoded;
        try {
            decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_KEY);
        } catch (err) {
            throw new Error("Invalid or expired refresh token");
        }

        const stored = await RefreshToken.findOne({ jti: decoded.jti, userId: decoded.id });
        if (!stored) {
            console.log("Refresh token already revoked or missing");
            return {
                revoked: false,
            };
        }

        stored.revoked = true;
        await stored.save();
        console.log(`Refresh token ${decoded.jti} revoked successfully`);
        return {
            revoked: true,
        };
    }

    async createTodo(request) {
        try {
            const todoTask = await TODO.create({
                owner: request.user.id,
                title: request.body.title,
                description: request.body.description
            })
            console.log("Todo Task is created successfully");
            return todoTask;
        } catch (error) {
            console.log(`Error in storing data in db: ${error}`);
        }
    }

    async deleteTodoTask(id) {
        return await TODO.findByIdAndDelete(id);

    }

    /**
     * Paginated list of todos for the current user
     * query params: ?page=1&limit=10
     */
    async listTodos(request) {
        const page = Math.max(parseInt(request.query.page) || 1, 1);
        const limit = Math.min(parseInt(request.query.limit) || 10, 100);

        const skip = (page - 1) * limit;
        const ownerId = request.user.id;

        const [items, total] = await Promise.all([
            TODO.find({ owner: ownerId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            TODO.countDocuments({ owner: ownerId })
        ]);

        const pages = Math.ceil(total / limit);
        const stringItem = JSON.stringify(items);
        return {
            page,
            limit,
            pages,
            total,
            stringItem
        };
    }

    async userExist(email) {
        const user = await User.findOne({ email });
        return user;
    }
}