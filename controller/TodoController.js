import { TodoModel } from "../model/TodoModel.js"
export class TodoController {
    constructor() {
        this.model = new TodoModel();
    }

    async registerUser(request, response) {
        try {
            const data = await this.model.registerUser(request);
            const message = "User registration is successfull";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            await this.setupErrorResponse(response, 500, "Error in registring user", error);
        }
    }

    async loginUser(request, response) {
        try {
            const data = await this.model.loginUser(request);
            const message = "login Successfull";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            await this.setupErrorResponse(response, 500, "Error while logging in", error);
        }
    }

    async createTodo(request, response) {
        try {
            const data = await this.model.createTodo(request);
            const message = "Todo task is created successfully.";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            await this.setupErrorResponse(response, 500, "failed to create todo task", error);
        }
    }

    async deleteTodoTask(request, response) {
        try {
            const data = await this.model.deleteTodoTask(request.params.id);
            const message = "Todo task is deleted successfully.";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            await this.setupErrorResponse(response, 500, "failed to delete todo task", error);
        }
    }

    async setupErrorResponse(response, status, message, error) {
        response.status(status).json({
            'success': false,
            message,
            'error': error ? error.message : undefined
        })
    }

    async setupResponse(response, status, message, data) {
        response.status(status).json({
            'success': true,
            message,
            data
        })
    }
}