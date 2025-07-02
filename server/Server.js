import express, { response } from "express"
import mongoose from "mongoose";
import { TodoController } from "../controller/TodoController.js";
import { middleware } from "../middleware/AuthMiddleware.js";

export class Server {

    async init() {
        this.app = express();
        await this.initDB();
        this.controller = new TodoController();
        this.app.use(express.json());
        this.setRoutes();
    }

    async initDB() {
        await mongoose.connect('mongodb://localhost:27017', {
            dbName: "todo_db"
        }).then(() => {
            console.log("DB connection is successfull");
        }).catch((error) => {
            console.log(`Error in connection with DB: ${error}`);
        })
    }

    setRoutes() {
        this.app.post('/todo', middleware, (request, response) => {
            this.controller.createTodo(request, response);
        })

        this.app.post('/register', (request, response) => {
            this.controller.registerUser(request, response);
        })

        this.app.post('/login', (request, response) => {
            this.controller.loginUser(request, response);
        })

        this.app.delete('/todo/:id', middleware, (request, response) => {
            this.controller.deleteTodoTask(request, response);
        })

        this.app.post('/refresh', (request, response) => {
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