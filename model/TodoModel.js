import { TODO } from "./TodoSchema.js";
import { User } from "./UserSchema.js";
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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '10s'
        })

        return token;
    }

    async createRefreshToken(user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_KEY, {
            expiresIn: '7d'
        })

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
        const refreshToken = request.body.token;
        if (!refreshToken) {
            throw new Error("Refresh token not found");
        }

        try {
            // compare the refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);

            // create token again
            const newAccessToken = await this.createToken(decoded);
            return { token: newAccessToken };
        } catch (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }
    }

    async createTodo(request) {
        try {
            const todoTask = await TODO.create({
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

    async userExist(email) {
        const user = await User.findOne({ email });
        return user;
    }
}