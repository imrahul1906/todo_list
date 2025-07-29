import express, { response } from "express"
import rateLimit from "express-rate-limit";
import { TodoController } from "../controller/TodoController.js";
import { middleware } from "../middleware/AuthMiddleware.js";
import { connectDB } from "../config/DatabaseConfig.js";

export class Server {

    async init() {
        this.app = express();
        await this.initDB();
        this.controller = new TodoController();
        this.app.use(express.json());
        await this.setupRateLimiter();
        this.setRoutes();
    }

    async setupRateLimiter() {
        const limiter = rateLimit({
            windowMs: 1 * 60 * 1000,
            max: 20,
            message: 'Too many requests from this IP, please try again later.',
        })

        this.app.use('/api', limiter);
    }

    async initDB() {
        await connectDB();
    }

    setRoutes() {
        this.app.post('/api/todo', middleware, (request, response) => {
            this.controller.createTodo(request, response);
        })

        this.app.get('/api/todo', middleware, (request, response) => {
            this.controller.listTodos(request, response);
        })

        this.app.post('/api/register', (request, response) => {
            this.controller.registerUser(request, response);
        })

        this.app.post('/api/login', (request, response) => {
            this.controller.loginUser(request, response);
        })

        this.app.post('/api/logout', (request, response) => {
            this.controller.logout(request, response);
        })

        this.app.delete('/api/todo/:id', middleware, (request, response) => {
            this.controller.deleteTodoTask(request, response);
        })

        this.app.post('/api/refresh', (request, response) => {
            this.controller.refreshToken(request, response);
        })
    }

    async startServer(port = 3000, host = '0.0.0.0') {
        this.app.listen(port, host, () => {
            console.log(`Server is started successfully on port: ${port}`);
        })

        this.app.on('error', (error) => {
            console.log(`Error in starting the server: ${error}`);
        })
    }
}