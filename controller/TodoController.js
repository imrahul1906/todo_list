import { TodoModel } from "../model/TodoModel.js"
export class TodoController {
    constructor() {
        this.model = new TodoModel();
    }

    statusFromError(error, fallback = 500) {
        if (error?.status && Number.isInteger(error.status)) return error.status;

        const msg = (error?.message || "").toLowerCase();

        // Authentication / authorisation issues
        if (msg.includes("invalid token") || msg.includes("expired token")) return 401;
        if (msg.includes("password wrong") || msg.includes("entered password is wrong")) return 401;

        // Duplicate / validation errors
        if (msg.includes("already exists") || msg.includes("duplicate")) return 409;

        // Bad input
        if (msg.includes("not provided") || msg.includes("not found") || msg.includes("missing")) return 400;

        return fallback;
    }

    async registerUser(request, response) {
        try {
            const data = await this.model.registerUser(request);
            const message = "User registration is successfull";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            const status = this.statusFromError(error);
            await this.setupErrorResponse(response, status, "Error in registring user", error);
        }
    }

    async loginUser(request, response) {
        try {
            const data = await this.model.loginUser(request);
            const message = "login Successfull";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            const status = this.statusFromError(error);
            await this.setupErrorResponse(response, status, "Error while logging in", error);
        }
    }

    async logout(request, response) {
        try {
            console.log("controller method");
            const data = await this.model.logout(request);
            const message = "logout Successfully";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            const status = this.statusFromError(error);
            await this.setupErrorResponse(response, status, "Error while logging out", error);
        }
    }

    async createTodo(request, response) {
        try {
            const data = await this.model.createTodo(request);
            const message = "Todo task is created successfully.";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            const status = this.statusFromError(error);
            await this.setupErrorResponse(response, status, "failed to create todo task", error);
        }
    }

    async listTodos(request, response) {
        try {
            const data = await this.model.listTodos(request);
            const message = "Todo tasks fetched successfully.";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            const status = this.statusFromError(error);
            await this.setupErrorResponse(response, status, "failed to fetch todo tasks", error);
        }
    }

    async refreshToken(request, response) {
        try {
            const data = await this.model.refreshToken(request);
            const message = "Token is refreshed successfully.";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            const status = this.statusFromError(error);
            await this.setupErrorResponse(response, status, "failed to refresh the token", error);
        }
    }

    async deleteTodoTask(request, response) {
        try {
            const data = await this.model.deleteTodoTask(request.params.id);
            const message = "Todo task is deleted successfully.";
            await this.setupResponse(response, 200, message, data);
        } catch (error) {
            const status = this.statusFromError(error);
            await this.setupErrorResponse(response, status, "failed to delete todo task", error);
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